(function() {
  var U = JSG.Util;
  var H = U.HTML;

  var NS = JSG.GameCore;

  NS.startGame = function(game_data) {
    var source_loaded = function() {
      $.log("continuing with game start");
      var GameConstructor = JSG.Games[game_data.game_name].Game;
      var game = new GameConstructor(game_data);
      var main_box = H("play-box");
      H.empty(main_box);
      main_box.appendChild(game.dom);
      game.start();
    };
    U.loadGame(game_data.game_name, source_loaded);
  };
}());
