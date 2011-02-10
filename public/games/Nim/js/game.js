(function() {
  var U = JSG.Util;
  var H = U.HTML;

  var NS = JSG.Games.Nim = JSG.Games.Nim || {};

  NS.Game = function(game_data) {
    NS.Game.superclass.constructor.call(this, game_data);
    this.board.game = this;
  };

  // TODO(zori): get #stones from user
  NS.Game.stones = 5;
  NS.Game.players = 2;

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

    initGameState: function() {
      this.stonesLeft = NS.Game.stones * NS.Game.stones;
      this.state = [];
      var i, j;
      var row;
      for (i = 0; i < NS.Game.stones; ++i) {
        row = [];
        for (j = 0; j < NS.Game.stones; ++j) {
          row.push(1);
        }
        this.state.push(row);
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
             this.state[move[0]][i] === 1 && i < NS.Game.stones;
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
          winner_idx: (this.current_player_idx + NS.Game.players - 1) %
              NS.Game.players,
          score: 1
        });
        return true;
      }
      return false;
    }

  });

}());
