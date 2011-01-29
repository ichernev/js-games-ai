(function() {
  var U = JSG.Util;
  var H = U.HTML;

  var NS = JSG.Games.TicTacToe = JSG.Games.TicTacToe || {};

  NS.Game = function(game_data) {
    NS.Game.superclass.constructor.call(this, game_data);
  };

  NS.Game.rows = 3;
  NS.Game.cols = 3;

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

    prepareBoardTokenMap: function() {
      var players = U.keys(this.players_info);
      players.sort();
      var tokens = ["circle", "cross"];
      var token_map = {};
      U.foreach(players, function(player_id, i) {
        token_map[player_id] = tokens[i];
      }, this);
      return token_map;
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
      this.state = [];
      var i, j;
      for (i = 0; i < NS.Game.rows; ++i) {
        var cr = [];
        for (j = 0; j < NS.Game.cols; ++j) {
          cr.push(-1);
        }
        this.state.push(cr);
      }
    },
    
    validMove: function(move) {
      return 0 <= move[0] && move[0] < NS.Game.rows &&
          0 <= move[1] && move[1] < NS.Game.cols &&
          this.state[move[0]][move[1]] === -1;
    },

    applyMove: function(move) {
      this.state[move[0]][move[1]] = this.current_player_idx;
    },

    stateIsFinal: function() {
      var i, j;
      var won = $.proxy(function(idx) {
        this.recordScore({
          type: "binary",
          winner_idx: idx,
          score: 2
        });
      }, null, this);
      // Test full rows.
      for (i = 0; i < NS.Game.rows; ++i) {
        for (j = 1; j < NS.Game.cols && this.state[i][j] === this.state[i][0]; ++j) {
          $.noop();
        }
        if (j === NS.Game.cols && this.state[i][0] !== -1) {
          won(this.state[i][0]);
          return true;
        }
      }
      // Test full cols.
      for (j = 0; j < NS.Game.cols; ++j) {
        for (i = 1; i < NS.Game.rows && this.state[i][j] === this.state[0][j]; ++i) {
          $.noop();
        }
        if (i === NS.Game.rows && this.state[0][j] !== -1) {
          won(this.state[0][j]);
          return true;
        }
      }
      if (NS.Game.rows === NS.Game.cols) {
        // Test main diagonal.
        for (i = 1; i < NS.Game.rows && this.state[i][i] === this.state[0][0]; ++i) {
          $.noop();
        }
        if (i === NS.Game.rows && this.state[0][0] !== -1) {
          won(this.state[0][0]);
          return true;
        }
        // Test second diagonal.
        for (i = 1; i < NS.Game.rows &&
            this.state[NS.Game.rows - 1 - i][i] === this.state[NS.Game.rows - 1][0]; ++i) {
          $.noop();
        }
        if (i === NS.Game.rows && this.state[NS.Game.rows - 1][0] !== -1) {
          won(this.state[NS.Game.rows - 1][0]);
          return true;
        }
      }
      // Test if board is full.
      for (i = 0; i < NS.Game.rows && $.inArray(-1, this.state[i]) === -1; ++i) {
        $.noop();
      }
      if (i === NS.Game.rows) {
        this.recordScore({
          type: "draw",
          score: 1
        });
        return true;
      }

      return false;
    }

  });

}());
