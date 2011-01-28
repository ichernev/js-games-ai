(function() {
  var U = JSG.Util;
  var H = U.HTML;

  var NS = JSG.UI;

  NS.GameList = function() {
    var games;
    var users;

    var loadGames = function() {
      $.getJSON("http://localhost:3000/info/games.json", handleGames);
    };

    var handleGames = function(games_) {
      games = games_;
      loadUsers();
    };

    var loadUsers = function() {
      $.getJSON("http://localhost:3000/game/users.json", handleUsers);
    };

    var handleUsers = function(users_) {
      users = users_.player_ids;
      displayGamesList();
    };

    var displayGamesList = function() {
      var local = users.length === 2;

      var buttons;
      if (local) {
        buttons = function(game_name) {
          return H.cdiv("ctl",
              H.button("play locally", {
                  onclick: function() {
                    play("local", game_name);
                  }
              }));
        };
      } else {
        buttons = function(game_name) {
          return H.cdiv("ctl",
              H.button("play vs AI", {
                  onclick: function() { play("ai", game_name); }
              }),
              H.button("play remotely", {
                  onclick: function() { play("remote", game_name); }
              }));
        };
      }

      var dom = H.div({ id: "game-list" },
          games.map(function(game) {
            return H.cdiv("game",
                H.cspan("title", game.display_name),
                H.cspan("desc", game.description),
                buttons(game.name));
          }));

      H("jsg-main").appendChild(dom);
    };

    var play = function(type, game_name) {
      var game_manager = JSG.GameCore.gameManager();
      if (type === "local") {
        game_manager.playLocal(game_name, users);
      } else if (type === "remote") {
        game_manager.playRemote(game_name, users[0]);
      } else if (type === "ai") {
        game_manager.playAI(game_name, users[0]);
      }
    };

    loadGames();
  };

}());
