(function() {
  var U = JSG.Util;
  var NS = JSG.Games.Nim = JSG.Games.Nim || {};

  NS.PerfectAI = function(player_id, game) {
    this.player_id = player_id;
    this.game = game;
    this.subscribe(this.game);
  };


  U.mix(NS.PerfectAI.prototype, U.EventTarget);
  U.mix(NS.PerfectAI.prototype, {
    
    playerTurn: function(player) {
      if (player.player_id === this.player_id) {
        var move = this.move(this.game.state);
        this.game.playMove(this.player_id, move);
      }
    },

    getStones: function(row) {
      return U.count(row, 1);
    },

    amountToMove: function(row, amount) {
      var zeroIx = U.foreach(this.game.state[row], function(val, i) {
        if (val === 1) {
          return i;
        }
      });
      if (this.game.current_player_idx === 0) {
        return [row, zeroIx + amount - 1];
      } else {
        // ix is 1
        return [row, zeroIx + this.getStones(this.game.state[row]) - amount];
      }
    },

    move: function(state) {
      var rows = [];
      var noZeroIx;
      U.foreach(state, function(row, i) {
        var stones = this.getStones(row);
        rows.push(stones);
        if (stones !== 0) {
          noZeroIx = i;
        }
      }, this);

      var res = 0;
      U.foreach(rows, function(num) {
        res ^= num;
      });

      if (res === 0) {
        $.log("Result is 0, we are losing.");
        var amount = 1;
        return this.amountToMove(noZeroIx, amount);
      } else {
        var ix = U.foreach(rows, function(row, i) {
          if ((row ^ res) < row) {
            return i;
          }
        });
        return this.amountToMove(ix, rows[ix] - (rows[ix] ^ res));
      }
    }

  });

}());
