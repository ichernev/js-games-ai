(function() {
  JSG.Temp = JSG.Temp || {};
  var U = JSG.Util;
  var H = U.HTML;
  var JSON = window.JSON;

  var response_handler = function(result) {
    return function(res) {
      H.empty(result);
      $.log(res);
      result.appendChild(H.txtNode(JSON.stringify(res, null, 4)));
    };
  };

  var game_play = function(game_name) {
    game_name = game_name || "TicTacToe";
    var player_ids = [645198450, 619222619];
    var instance_id;

    var handle_new = function(data) {
      if (!data.status) {
        $.log(["error with new game", data.message]);
        return;
      }
      instance_id = data.instance_id;
      $.log("got instance id", instance_id);
      play_game();
    };
    var new_game = function() {
      $.ajax({
          type: "POST",
          url: "http://localhost:3000/game/" + game_name + "/new.json",
          //url: "http://localhost:3005/game/name/new.json",
          dataType: "json",
          data: { players: JSON.stringify(player_ids) },
          success: handle_new
      });
    };
    var handle_play = function(data) {
      if (!data.status) {
        $.log(["error with play game", data]);
        return;
      }
      $.log(["got data for play", data]);
      JSG.GameCore.start_game(data);
    };
    var play_game = function() {
      if (!instance_id) {
        $.log("no instance id, use new first");
        return;
      }

      $.getJSON(
          "http://localhost:3000/game/play.json",
          //"http://localhost:3005/game/play.json",
          {
            instance_id: instance_id
          },
          handle_play);
    };
    return {
      new_game: new_game,
      play_game: play_game
    };
  };

  JSG.Temp.test_game_cycle = function() {
    var root = H("jsg-main");
    var game_ops = game_play();
    $(H.button("TicTacToe")).click(game_ops.new_game).appendTo(root);

    var game_rocks = game_play("Rocks");
    $(H.button("Rocks")).click(game_rocks.new_game).appendTo(root);
  };

  JSG.Temp.game_test_init = function() {
    var root = H("jsg-main");
    H.empty(root);
    var result = H.pre();
    var printer = response_handler(result);
    root.appendChild(H([
      H.button("ai", {
        onclick: function() {
          $.getJSON("http://localhost:3000/game/Rocks/ai.json", printer);
          //$.getJSON("http://localhost:3005/game/name/ai.json", printer);
        }
      }),
      H.button("new", {
        onclick: function() {
          $.ajax({
            type: "POST",
            url: "http://localhost:3000/game/Rocks/new.json",
            //url: "http://localhost:3005/game/name/new.json",
            dataType: "json",
            data: { players: JSON.stringify([590696008, 619222619]) },
            success: printer
          });
        }
      }),
      H.button("play", {
        onclick: function() {
          $.getJSON(
            "http://localhost:3000/game/play.json",
            //"http://localhost:3005/game/play.json",
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
            url: "http://localhost:3000/game/finish.json",
            //url: "http://localhost:3005/game/finish.json",
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
          $.getJSON("http://localhost:3000/info/games.json", printer);
        }
      }),
      result
    ]));
  };

}());
