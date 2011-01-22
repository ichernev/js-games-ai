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
    var button = H.button("ai"), result = H.pre();
    var printer = response_handler(result);
    $(button).bind("click", function() {
      $.getJSON("http://localhost:3005/game/name/ai.json", printer);
    });
    root.appendChild(button);
    button = H.button("new");
    $(button).bind("click", function() {
      // $.post(
      //     "http://localhost:3005/game/name/new.json",
      //     // { players: JSON.stringify([1,2,3]) },
      //     "some-raw_data",
      //     printer,
      //     "json");
      $.ajax({
        type: 'POST',
        url: "http://localhost:3005/game/name/new.json",
        dataType: "json",
        data: { players: JSON.stringify([1234, 3456]) },
        // data: "ala=bala",
        success: printer
      });
    });
    root.appendChild(button);
    root.appendChild(result);
  };
}());
