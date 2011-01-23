(function() {
  var U = JSG.Util;
  var H = U.HTML;

  var NS = JSG.Games.TicTacToe = JSG.Games.TicTacToe || {};

  NS.Game = function(game_data) {
    this.dom = H.div({ id: "tictactoe_main" });
    this.ev = new U.Event();
    this.board = new NS.Board(this.dom);

    this.instance_id = game_data.instance_id;
    // this.players_info = game_data.players;
    this.players_info = {};
    U.foreach(game_data.players, function(player) {
      this.players_info[player.player_id] = player;
    }, this);
    this.computePlayOrder(game_data);

    (function() {
      var players = [];
      U.foreach(this.players_info, function(player) {
        players.push(player.player_id);
      });
      players.sort();
      var tokens = ["circle", "cross"];
      this.board.token_map = {};
      U.foreach(players, function(player_id, i) {
        this.board.token_map[player_id] = tokens[i];
      }, this);
    }.call(this));

    this.players = {};
    U.foreach(this.players_info, function(player) {
      var user;
      if (player.type === "LocalUser") {
        user = new NS.LocalUser(player.player_id, this);
        user.subscribe(this.board);
        this.players[player.player_id] = user;
      } else {
        throw "Implement me";
      }
    }, this);

    this.initGameState();

    this.dom.appendChild(H.span(
        this.current_player_label = H.span("Current player: "),
        this.current_player_span = H.span()));
  };

  NS.Game.rows = 3;
  NS.Game.cols = 3;

  U.mix(NS.Game.prototype, U.EventTarget);
  U.mix(NS.Game.prototype, {
    computePlayOrder: function(game_data) {
      this.play_order = U.keys(game_data.players);
      this.play_order.sort(this.playOrderSorter(game_data.last_game_info));
      U.foreach(this.play_order, function(player_id, order) {
        this.players_info[player_id].play_order = order;
      }, this);
    },

    playOrderSorter: function(last_game_info) {
      if (!last_game_info) {
        return undefined;
      }
      return function(p1, p2) {
        return last_game_info[p2].play_order - last_game_info[p1].play_order;
      };
    },

    currentPlayer: function() {
      return this.players_info[this.play_order[this.current_player_idx]];
    },

    start: function () {
      this.current_player_idx = 0;
      this.prepareNextTurn();
    },

    finish: function() {
      var winner_id = null;
      this.board.lock();
      U.foreach(this.players_info, function(player, player_id) {
        if (winner_id === null ||
            player.score > this.players_info[winner_id].score) {
          winner_id = player_id;
        }
      }, this);
      H.text(this.current_player_label, "Winner: ");
      H.text(this.current_player_span,
          this.players_info[winner_id].display_name);
      this.reportToBackend();
    },

    reportToBackend: function() {
      $.log(["reporting to backend", this.players_info]);
    },

    playMove: function(player_id, move) {
      $.log(["play move", player_id, move]);
      if (player_id !== this.currentPlayer().player_id) {
        throw "User not in turn";
      }
      if (!this.validMove(move)) {
        throw "Bad move!";
      }
      this.applyMove(move);
      this.board.displayMove(this.currentPlayer().player_id, move);
      this.ev.fire("playerMove", this.currentPlayer(), move);
      this.current_player_idx =
          (this.current_player_idx + 1) % this.play_order.length;
      this.prepareNextTurn();
    },

    prepareNextTurn: function() {
      if (this.stateIsFinal()) {
        this.finish();
        return;
      }
      H.text(this.current_player_span, this.currentPlayer().display_name);
      if (this.currentPlayer().type === "LocalUser") {
        this.board.unlock();
      }
      this.ev.fire("playerTurn", this.currentPlayer());
    },

    // Game specific.
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
      for (i = 0; i < NS.Game.rows; ++i) {
        for (j = 1; j < NS.Game.cols && this.state[i][j] === this.state[i][0]; ++j) { $.noop(); }
        if (j === NS.Game.cols && this.state[i][0] !== -1) {
          this.won(this.state[i][0]);
          return true;
        }
      }
      for (j = 0; j < NS.Game.cols; ++j) {
        for (i = 1; i < NS.Game.rows && this.state[i][j] === this.state[0][j]; ++i) { $.noop(); }
        if (i === NS.Game.rows && this.state[0][j] !== -1) {
          this.won(this.state[0][j]);
          return true;
        }
      }
      if (NS.Game.rows === NS.Game.cols) {
        for (i = 1; i < NS.Game.rows && this.state[i][i] === this.state[0][0]; ++i) { $.noop(); }
        if (i === NS.Game.rows && this.state[0][0] !== -1) {
          this.won(this.state[0][0]);
          return true;
        }
        for (i = 1; i < NS.Game.rows && this.state[NS.Game.rows - 1 - i][i] === this.state[NS.Game.rows - 1][0]; ++i) { $.noop(); }
        if (i === NS.Game.rows && this.state[NS.Game.rows - 1][0] !== -1) {
          this.won(this.state[NS.Game.rows - 1][0]);
          return true;
        }
      }

      return false;
    },

    won: function(player_idx) {
      var winner_id = this.play_order[player_idx];
      U.foreach(this.players_info, function(player) {
        player.score = (player.player_id === winner_id ? 1 : 0);
      });
    }

  });

  NS.Game._test = function() {
    var game = new NS.Game({
      instance_id: 123,
      players: {
        "222": {
          player_id: "222",
          display_name: "Gosho",
          type: "LocalUser"
        },
        "333": {
          player_id: "333",
          display_name: "Pesho",
          type: "LocalUser"
        }
      }
    });
    H("jsg-main").appendChild(game.dom);
    game.start();
  };

}());
