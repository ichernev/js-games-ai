(function() {
  var U = JSG.Util;
  var H = U.HTML;

  var NS = JSG.UI;

  NS.playButtons = function() {
    var buttons = function(game_name) {
      var users = JSG.Data.local_users;
      if (users.length === 2) {
        return H.cdiv("ctl",
            H.button("play locally", {
                onclick: function() {
                  JSG.ev.fire("playGame", game_name, "local");
                  // play("local", game_name);
                }
            }));
      } else if (users.length === 1) {
        return H.cdiv("ctl",
            H.button("play vs AI", {
                onclick: function() {
                  // play("ai", game_name);
                  JSG.ev.fire("playGame", game_name, "ai");
                }
            }),
            H.button("play remotely", {
                onclick: function() {
                  // play("remote", game_name);
                  JSG.ev.fire("playGame", game_name, "remote");
                }
            }));
      } else {
        return H.cdiv("ctl",
            H.button("you need to log in in order to play", {
                disabled: true
            }));
      }
    };
    return buttons;
  };

  NS.GameList = function(ops, cb) {
    var games;
    var users;

    var loadGames = function() {
      $.getJSON("http://localhost:3000/info/games.json", handleGames);
    };

    var handleGames = function(games_) {
      games = games_;
      JSG.Data.games = games;
      loadUsers();
    };

    var loadUsers = function() {
      $.getJSON("http://localhost:3000/game/users.json", handleUsers);
    };

    var handleUsers = function(users_) {
      if (!users_.status) {
        users = [];
      } else {
        users = users_.player_ids;
      }
      JSG.Data.local_users = users;
      displayGamesList();
    };

    var displayGamesList = function() {

      var global_game = {
        name: "_global",
        display_name: "All Games",
        description: "Meta Game used in stats"
      };
      var all_games = ops.include_global ? [global_game].concat(games) : games;
      var dom = H.div({ id: "game-list" },
          games.map(function(game) {
            return H.cdiv("game",
                H.cspan("title", game.display_name),
                (ops.has_desc ? H.cspan("desc", game.description) : null),
                ops.bottom(game.name));
          }));
      

      cb(dom);
      // H("jsg-main").appendChild(dom);
    };

    // var play = function(type, game_name) {
    //   JSG.ev.fire("playGame", game_name, type);
    //   // var game_manager = JSG.GameCore.gameManager();
    //   // if (type === "local") {
    //   //   game_manager.playLocal(game_name, users);
    //   // } else if (type === "remote") {
    //   //   game_manager.playRemote(game_name, users[0]);
    //   // } else if (type === "ai") {
    //   //   game_manager.playAI(game_name, users[0]);
    //   // }
    // };

    loadGames();
  };

}());
