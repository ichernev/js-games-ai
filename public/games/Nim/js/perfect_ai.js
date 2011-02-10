(function() {
  var U = JSG.Util;
  var NS = JSG.Games.Nim = JSG.Games.Nim || {};

  var find_win = function(len, other, sgs) {
    var k, j, p2, cxor;
    for (k = 1; k <= 2; ++k) {
      for (j = 0; j + k <= len; ++j) {
        p2 = len - j - k;
        cxor = sgs[j] ^ sgs[p2] ^ other;
        if (cxor === 0) {
          return j * 2 + (k - 1);
        }
      }
    }
    return -1;
  };

  NS.PerfectAI = function(player_id, game) {
    this.player_id = player_id;
    this.game = game;
    this.subscribe(this.game);

    this.precompute();
  };


  U.mix(NS.PerfectAI.prototype, U.EventTarget);
  U.mix(NS.PerfectAI.prototype, {
    
    precompute: function() {
      var N = NS.Game.nim;
      var sgs = new Array(N + 1);
      var used = new Array(N + 1);
      sgs[0] = 0;
      var i, j, k, p2, cxor, csg;
      for (i = 1; i <= N; ++i) {
        for (k = 1; k <= 2; ++k) {
          for (j = 0; j + k <= i; ++j) {
            p2 = i - j - k;
            cxor = sgs[j] ^ sgs[p2];
            used[cxor] = i;
          }
        }
        for (csg = 0; used[csg] === i; ++csg) { $.noop(); }
        // $.log("%d -> %d", i, csg);
        sgs[i] = csg;
      }
      this.sgs = sgs;
      this.N = N;
    },

    playerTurn: function(player) {
      if (player.player_id === this.player_id) {
        var move = this.move(this.game.state);
        this.game.playMove(this.player_id, move);
      }
    },

    move: function(state) {
      state = state.concat([0]);
      var N = this.N;
      var sgs = this.sgs;

      var segs = [];
      var tot_sg = 0;
      var beg = 0;
      var i, len, move;
      for (i = 1; i <= N; ++i) {
        if (state[i] === 0 && state[i-1] === 1) {
          len = i - beg;
          segs.push([beg, len]);
          tot_sg ^= sgs[len];
        } else if (state[i-1] === 0 && state[i] === 1) {
          beg = i;
        }
      }

      var k, j;
      var res;
      for (i = 0; i < segs.length; ++i) {
        move = find_win(segs[i][1], tot_sg ^ sgs[segs[i][1]], sgs);
        if (move >= 0) {
          k = move % 2 + 1;
          j = U.div(move, 2);
          res = [segs[i][0] + j];
          if (k === 2) {
            res.push(segs[i][0] + j + 1);
          }
          return res;
        }
      }
      $.log("losing");
      return [segs[0][0]];
    }

  });

}());
