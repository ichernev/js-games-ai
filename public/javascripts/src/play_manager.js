(function() {
  var U = JSG.Util;

  var NS = JSG.GameCore;

  NS.PlayManager = function() {
    this.subscribe(JSG);
  };

  U.mix(NS.PlayManager.prototype, U.EventTarget);
  U.mix(NS.PlayManager.prototype, {
    playGame: function(game_name, type) {
      var game_manager = NS.gameManager();
      var users = JSG.Data.local_users;
      if (type === "local") {
        game_manager.playLocal(game_name, users);
      } else if (type === "remote") {
        game_manager.playRemote(game_name, users[0]);
      } else if (type === "ai") {
        game_manager.playAI(game_name, users[0]);
      }
    }
  });
}());
