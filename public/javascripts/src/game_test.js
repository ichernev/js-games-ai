(function() {
  JSG.Temp = JSG.Temp || {};
  var U = JSG.Util;
  var H = U.HTML;
  var JSON = window.JSON;

  var response_handler = function(result) {
    return function(res) {
      H.empty(result);
      $.log(res);
      result.appendChild(document.createTextNode(JSON.stringify(res, null, 4)));
    };
  };

  JSG.Temp.game_test_init = function() {
    var root = H("jsg-main");
    H.empty(root);
    var result = H.pre();
    var printer = response_handler(result);
    root.appendChild(H([
      H.button("ai", {
        onclick: function() {
          $.getJSON("http://localhost:3005/game/name/ai.json", printer);
        }
      }),
      H.button("new", {
        onclick: function() {
          $.ajax({
            type: 'POST',
            url: "http://localhost:3005/game/name/new.json",
            dataType: "json",
            data: { players: JSON.stringify([1234, 3456]) },
            success: printer
          });
        }
      }),
      H.button("play", {
        onclick: function() {
          $.getJSON(
            "http://localhost:3005/game/play.json",
            {
              instance_id: "1234"
            },
            printer);
        }
      }),
      H.button("finish", {
        onclick: function() {
          $.ajax({
            type: "POST",
            url: "http://localhost:3005/game/finish.json",
            dataType: "json",
            success: printer,
            data: {
              game_instance_info: JSON.stringify({
                instance_id: 1234,
                game_result: [
                  {
                    player_id: 5,
                    play_order: 1,
                    score: 1
                  }, {
                    player_id: 10,
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
}());
