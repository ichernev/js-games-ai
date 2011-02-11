(function() {
  var U = JSG.Util;
  var H = U.HTML;

  var NS = JSG.Games.Nim = JSG.Games.Nim || {};

  NS.Game = function(game_data) {
    NS.Game.superclass.constructor.call(this, game_data);
    this.board.game = this;
  };

  U.extend(NS.Game, JSG.GameCore.BaseGame);
  U.mix(NS.Game.prototype, {
    boardConstructor: function() { return NS.Board; },

    createPlayer: function(player) {
      if (player.type === "AI") {
        var user = new NS.PerfectAI(player.player_id, this);
        user.subscribe(this.board);
        this.players[player.player_id] = user;
      } else {
        throw "Unsupported player type " + player.type;
      }
    },

    // TODO(zori): remove from base class
    prepareBoardTokenMap: function() {
      return undefined;
    },

    // TODO: Use available sorters (when implemented).
    playOrderSorter: function(last_game_info) {
      if (!last_game_info) {
        return undefined;
      }
      return function(p1, p2) {
        return last_game_info[p2].play_order - last_game_info[p1].play_order;
      };
    },

    initGameConf: function() {
      this.conf = {
        piles: U.randInt(5, 10),
        max_pile: U.randInt(5, 12),
        players: 2
      };
    },

    initGameState: function() {
      this.stonesLeft = 0;
      this.state = [];
      var i, j;
      var row;
      // Create empty state matrix.
      for (i = 0; i < this.conf.piles; ++i) {
        row = [];
        for (j = 0; j < this.conf.max_pile; ++j) {
          row.push(0);
        }
        this.state.push(row);
      }
      var pile_size, pile_off;
      for (i = 0; i < this.conf.piles; ++i) {
        pile_size = U.randInt(1, this.conf.max_pile + 1);
        pile_off = U.div(this.conf.max_pile - pile_size, 2);
        for (j = 0; j < pile_size; ++j) {
          this.state[i][j + pile_off] = 1;
        }
        this.stonesLeft += pile_size;
      }
    },
    
    validMove: function(move) {
      return move !== undefined &&
          move.length === 2 &&
          this.state[move[0]][move[1]] === 1;
    },

    applyMove: function(move) {
      var i = 0;
      if (this.current_player_idx === 0) {
        for (i = move[1];
             this.state[move[0]][i] === 1 && i >= 0;
             --i) {
          this.state[move[0]][i] = 0;
          --this.stonesLeft;
        }
      } else {
        // this.current_player_idx === 1
        for (i = move[1];
             this.state[move[0]][i] === 1 && i < this.conf.max_pile;
             ++i) {
          this.state[move[0]][i] = 0;
          --this.stonesLeft;
        }
      }
    },

    stateIsFinal: function() {
      if (this.stonesLeft <= 0) {
        this.recordScore({
          type: "binary",
          winner_idx: (this.current_player_idx + this.conf.players - 1) %
              this.conf.players,
          score: 1
        });
        return true;
      }
      return false;
    }

  });

}());
