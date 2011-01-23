(function() {
  var U = JSG.Util;
  var H = U.HTML;

  var NS = JSG.GameCore;

  var fix_player_id = function(players) {
    U.foreach(players, function(player) {
      if (isFinite(player.player_id)) {
        $.log("player_id was integer!");
      }
      player.player_id = String(player.player_id);
    });
  };

  NS.start_game = function(game_data) {
    var GameConstructor = JSG.Games[game_data.game_name].Game;
    fix_player_id(game_data.players);
    var game = new GameConstructor(game_data);
    H("jsg-main").appendChild(game.dom);
    game.start();
  };
}());
