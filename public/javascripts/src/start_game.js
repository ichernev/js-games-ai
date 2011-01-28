(function() {
  var U = JSG.Util;
  var H = U.HTML;

  var NS = JSG.GameCore;

  NS.startGame = function(game_data) {
    // TODO(iskren): Dynamic loading here!
    var GameConstructor = JSG.Games[game_data.game_name].Game;
    var game = new GameConstructor(game_data);
    var main_box = H("main-box");
    H.empty(main_box);
    main_box.appendChild(game.dom);
    game.start();
  };
}());
