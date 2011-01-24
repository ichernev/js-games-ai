(function() {
  var U = JSG.Util;
  var H = U.HTML;

  var NS = JSG.Games.Rocks = JSG.Games.Rocks || {};

  NS.Game = function(game_data) {
    NS.Game.superclass.constructor.call(this, game_data);
  };

  // TODO(zori): get #rocks from user
  NS.Game.rocks = 8;
  NS.Game.players = 2;

  U.extend(NS.Game, JSG.GameCore.BaseGame);
  U.mix(NS.Game.prototype, {
    boardConstructor: function() { return NS.Board; },

    prepareBoardTokenMap: function() {
      // TODO(zori): remove from base class
      //var players = U.keys(this.players_info);
      //players.sort();
      //var tokens = ["circle", "cross"];
      //var token_map = {};
      //U.foreach(players, function(player_id, i) {
      //  token_map[player_id] = tokens[i];
      //}, this);
      //return token_map;
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
      this.rocksLeft = NS.Game.rocks;
      this.state = [];
      var i = 0;
      for (; i < NS.Game.rocks; ++i) {
        this.state.push(1);
      }
    },
    
    validMove: function(move) {
      return 1 === move.length && 1 === this.state[move[0]] ||
          2 === move.length && 1 === this.state[move[0]] &&
          1 === this.state[move[1]] && 1 === Math.abs(move[0] - move[1]);
    },

    applyMove: function(move) {
      U.foreach(move, function(m) {
        this.state[m] = 0;
        -- this.rocksLeft;
      }, this);
    },

    stateIsFinal: function() {
      if (0 === this.rocksLeft) {
        this.recordScore({
          type: "binary",
          // TODO(zori): double check this
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
