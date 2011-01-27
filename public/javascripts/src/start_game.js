(function() {
  var U = JSG.Util;
  var H = U.HTML;

  var NS = JSG.GameCore;

  NS.startGame = function(game_data) {
    // TODO(iskren): Dynamic loading here!
    var GameConstructor = JSG.Games[game_data.game_name].Game;
    var game = new GameConstructor(game_data);
    H("jsg-main").appendChild(game.dom);
    game.start();
  };
}());
