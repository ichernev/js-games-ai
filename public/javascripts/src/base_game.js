(function() {
  var U = JSG.Util;
  var H = U.HTML;

  var NS = JSG.GameCore;

  NS.BaseGame = function(game_data) {
    this.dom = H.div({
      id: game_data.game_name.toLowerCase() + "_main",
      cls: "game-main"
    });
    this.ev = new U.Event();
    this.board = new (this.boardConstructor())();
    this.name = game_data.game_name;

    this.instance_id = game_data.instance_id;
    this.players_info = game_data.players;
    this.computePlayOrder(game_data);

    // TODO(iskren): Remove this. Only for testing!
    // Change one of the players to AI to test it.
    // NOTE(zori): very funny, iskren :)!
    //this.players_info[U.keys(this.players_info)[0]].type = "AI";

    this.board.token_map = this.prepareBoardTokenMap();
    this.players = {};
    var has_remote = false;
    U.foreach(this.players_info, function(player) {
      var user;
      if (player.type === "LocalUser") {
        user = new NS.LocalUser(player.player_id, this);
        user.subscribe(this.board);
        this.players[player.player_id] = user;
      } else if (player.type === "RemoteUser") {
        has_remote = true;
      } else {
        this.createPlayer(player);
      }
    }, this);
    if (has_remote) {
      $.log("creating remote gateway");
      this.remote_gateway = new NS.RemoteGateway(this.players_info, this);
    }

    this.initGameState();

    this.fillDom();
  };

  U.mix(NS.BaseGame.prototype, U.EventTarget);
  U.mix(NS.BaseGame.prototype, {
    computePlayOrder: function(game_data) {
      this.play_order = U.keys(game_data.players);
      if (game_data.last_game_result) {
        this.play_order.sort(this.playOrderSorter(game_data.last_game_result));
      } else {
        // passing undefine is NOT an option.
        this.play_order.sort();
      }
      U.foreach(this.play_order, function(player_id, order) {
        this.players_info[player_id].play_order = order;
      }, this);
    },

    fillDom: function() {
      this.dom.appendChild(H.cdiv("game-title ui-widget-header", this.name));
      this.dom.appendChild(this.board.ui.dom);
      this.dom.appendChild(H.cdiv("game-turn-info ui-state-highlight",
          this.current_player_label = H.cspan("turn-label", "Current player: "),
          this.current_player_span = H.cspan("turn-user")));
    },

    currentPlayer: function() {
      return this.players_info[this.play_order[this.current_player_idx]];
    },

    start: function () {
      this.current_player_idx = 0;
      this.prepareNextTurn();
    },

    finish: function() {
      this.board.lock();
      this.displayWinner();
      this.reportToBackend();
    },

    // Maybe override in subclasses.
    displayWinner: function() {
      // Sort player indexes by their score, high -> low.
      var idx = U.iota(this.play_order.length);
      var players_arr = U.vals(this.players_info);
      idx.sort(function(id1, id2) {
        return players_arr[id2].score - players_arr[id1].score;
      });
      var lbl, name;
      if (players_arr[idx[0]].score === players_arr[idx[idx.length - 1]].score) {
        lbl = "Draw";
        name = "";
      } else if (players_arr[idx[0]].score !== players_arr[idx[1]].score) {
        lbl = "Winner: ";
        name = players_arr[idx[0]].display_name;
      } else {
        lbl = "Its complicated...";
        name = "";
      }

      H.text(this.current_player_label, lbl);
      H.text(this.current_player_span, name);
    },

    reportToBackend: function() {
      $.log(["reporting to backend", this.players_info]);
      $.ajax({
        type: "POST",
        url: JSG.Data.RAILS + "game/finish.json",
        dataType: "json",
        success: $.proxy(this, "handleFinishResponse"),
        data: {
          game_info: window.JSON.stringify({
            instance_id: this.instance_id,
            game_result: this.players_info // or U.values of this
          })
        }
      });
    },

    handleFinishResponse: function(data) {
      if (!data.status) {
        $.log(["error with game finish", data.message]);
        return;
      }
      $.log("game result reported successfully to backend");
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
      this.board[this.currentPlayer().type === "LocalUser" ? "unlock" : "lock"]();
      this.ev.fire("playerTurn", this.currentPlayer());
    },

    recordScore: function(score_info) {
      if (score_info.type === "binary") {
        if (score_info.winner_idx !== undefined) {
          score_info.winner_id = this.play_order[score_info.winner_idx];
        }
        if (!$.isArray(score_info.score)) {
          score_info.score = [score_info.score];
        }
        if (score_info.score.length < this.play_order.length) {
          var i;
          for (i = score_info.score.length; i < this.play_order.length; ++i) {
            score_info.score.push(0);
          }
        }
        U.foreach(this.players_info, function(player) {
          player.score = score_info.score[
              (player.player_id === score_info.winner_id) ? 0 : 1];
        });
      } else if (score_info.type === "draw") {
        U.foreach(this.players_info, function(player) {
          player.score = score_info.score;
        });
      } else {
        throw "unknown score type " + score_info.type;
      }
    },

    boardConstructor: function() {
      throw "override";
    },

    // TODO: Implement sorter functions.
    playOrderSorter: function(last_game_info) {
      throw "override";
    },

    initGameState: function() {
      throw "override";
    },
    
    validMove: function(move) {
      throw "override";
    },

    applyMove: function(move) {
      throw "override";
    },

    stateIsFinal: function() {
      throw "override";
    }

  });

}());
