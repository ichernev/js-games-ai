(function() {
  JSG.Temp = JSG.Temp || {};
  var U = JSG.Util;
  var H = U.HTML;
  var JSON = window.JSON;
  var socket;

  var response_handler = function(result) {
    return function(res) {
      H.empty(result);
      $.log(res);
      result.appendChild(H.txtNode(JSON.stringify(res, null, 4)));
    };
  };

  var game_play = function(game_name) {
    game_name = game_name || "TicTacToe";
    var type;
    var player_ids;
    var instance_id;
    var active;

    var get_users = function() {
      $.getJSON(JSG.Data.RAILS + "game/users.json", handle_users);
    };
    var handle_users = function(data) {
      if (!data.status) {
        $.log(["error with get users", data.message]);
        return;
      }
      player_ids = data.player_ids;
      $.log("got player ids", player_ids);
      // TODO(iskren): Fix for more users.
      if (player_ids.length === 2) {
        newGame();
      } else if (player_ids.length === 1) {
        // TODO(iskren): Add AI.
        $.log("assuming remote user");
        socket = new io.Socket(JSG.Data.DOMAIN, { port: JSG.Data.NODE_PORT });
        socket.on("connect", function() {
          $.log("subscribing to channel " + game_name);
          socket.send({
            _type: "subscribe", 
            _channel_id: game_name,
            _player_id: player_ids[0]
          });
        });
        socket.on("message", function(data) {
          $.log(["got message from socket", data]);
          if (data._type === "clients" && data._clients.length === 2) {
            data._clients.sort();
            if (data._clients[0] === player_ids[0]) {
              $.log("we are active");
              active = true;
              player_ids = data._clients;
              newGame();
            } else {
              $.log("we are passive");
              active = false;
            }
          } else if (!active && data.instance_id) {
            $.log(["got instance id from active player", data.instance_id]);
            instance_id = data.instance_id;
            socket.disconnect();
            playGame();
          }
        });
        socket.connect();
      }
    };
    var playLocal = function(game_name_, player_ids_) {
      type = "local";
      player_ids = player_ids_;
      game_name = game_name_;
      newGame();
    };
    var playRemote = function(game_name_, local_player_id) {
      type = "remote";
      game_name = game_name_;
      // Find a remote user.
      socket = new io.Socket(JSG.Data.DOMAIN, { port: JSG.Data.NODE_PORT });
      socket.on("connect", function() {
        $.log("subscribing to channel " + game_name);
        socket.send({
          _type: "subscribe", 
          _channel_id: game_name,
          _player_id: local_player_id
        });
      });
      socket.on("message", function(data) {
        $.log(["got message from socket", data]);
        if (data._type === "clients" && data._clients.length === 2) {
          data._clients.sort();
          if (data._clients[0] === local_player_id) {
            $.log("we are active");
            active = true;
            player_ids = data._clients;
            newGame();
          } else {
            $.log("we are passive");
            active = false;
          }
        } else if (!active && data.instance_id) {
          $.log(["got instance id from active player", data.instance_id]);
          instance_id = data.instance_id;
          socket.disconnect();
          playGame();
        }
      });
      socket.connect();
    };
    var playAI = function(game_name_, player_id, ai_player_id) {
      game_name = game_name_;
      player_ids = [player_id];
      if (ai_player_id === undefined) {
        $.getJSON(JSG.Data.RAILS + "game/" + game_name + "/ai.json", handleAI);
      } else {
        player_ids.push(ai_player_id);
        newGame();
      }
    };
    var handleAI = function(data) {
      if (!data.status) {
        $.log(["error with ai call", data.message]);
        return;
      }
      if (data.ai.length < 1) {
        $.log(["could not find ai for game", game_name]);
        return;
      }
      // Choosing the first ai (normally ai should be chosen in the game list).
      player_ids.push(data.ai[0].player_id);
      newGame();
    };
    var newGame = function() {
      $.log(["sending new game with player_ids", player_ids]);
      $.ajax({
          type: "POST",
          url: JSG.Data.RAILS + "game/" + game_name + "/new.json",
          dataType: "json",
          data: { players: JSON.stringify(player_ids) },
          success: handleNew
      });
    };
    var handleNew = function(data) {
      if (!data.status) {
        $.log(["error with new game", data.message]);
        return;
      }
      instance_id = data.instance_id;
      if (type === "remote" && active) {
        $.log("sending instance_id to passive player", socket);
        socket.send({
          instance_id: instance_id
        });
        // TODO(iskren): I really don't know what.
        // socket.disconnect();
      }
      $.log("got instance id", instance_id, active);
      playGame();
    };
    var playGame = function() {
      if (!instance_id) {
        $.log("no instance id, use new first");
        return;
      }

      $.getJSON(
          JSG.Data.RAILS + "game/play.json",
          {
            instance_id: instance_id
          },
          handle_play);
    };
    var handle_play = function(data) {
      if (!data.status) {
        $.log(["error with play game", data]);
        return;
      }
      $.log(["got data for play", data]);
      JSG.GameCore.start_game(data);
    };
    return get_users;
  };

  JSG.Temp.test_game_cycle = function() {
    var root = H("jsg-main");
    var game_ops = game_play();
    $(H.button("TicTacToe")).click(game_ops).appendTo(root);

    var game_rocks = game_play("Rocks");
    $(H.button("Rocks")).click(game_rocks).appendTo(root);
  };

  JSG.Temp.game_test_init = function() {
    var root = H("jsg-main");
    H.empty(root);
    var result = H.pre();
    var printer = response_handler(result);
    root.appendChild(H([
      H.button("ai", {
        onclick: function() {
          $.getJSON(JSG.Data.RAILS + "game/Rocks/ai.json", printer);
        }
      }),
      H.button("new", {
        onclick: function() {
          $.ajax({
            type: "POST",
            url: JSG.Data.RAILS + "game/Rocks/new.json",
            dataType: "json",
            data: { players: JSON.stringify([590696008, 619222619]) },
            success: printer
          });
        }
      }),
      H.button("play", {
        onclick: function() {
          $.getJSON(
            JSG.Data.RAILS + "game/play.json",
            {
              instance_id: "908005739"
            },
            printer);
        }
      }),
      H.button("finish", {
        onclick: function() {
          $.ajax({
            type: "POST",
            url: JSG.Data.RAILS + "game/finish.json",
            dataType: "json",
            success: printer,
            data: {
              game_info: JSON.stringify({
                instance_id: 908005739,
                game_result: [
                  {
                    player_id: 590696008,
                    play_order: 1,
                    score: 1
                  }, {
                    player_id: 619222619,
                    play_order: 0,
                    score: 0
                  }
                ]
              })
            }
          });
        }
      }),
      result
    ]));
  };

  JSG.Temp.get_request = function() {
    var root = H("jsg-main");
    H.empty(root);
    var result = H.pre();
    var printer = response_handler(result);
    root.appendChild(H([
      H.button("test get request", {
        onclick: function() {
          $.getJSON(JSG.Data.RAILS + "info/games.json", printer);
        }
      }),
      result
    ]));
  };

}());
