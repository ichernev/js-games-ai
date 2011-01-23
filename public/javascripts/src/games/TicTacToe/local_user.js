(function() {
  var U = JSG.Util;

  var NS = JSG.Games.TicTacToe = JSG.Games.TicTacToe || {};

  NS.LocalUser = function(player_id, game) {
    this.player_id = player_id;
    this.game = game;
    this.subscribe(this.game);
  };

  U.mix(NS.LocalUser.prototype, U.EventTarget);
  U.mix(NS.LocalUser.prototype, {
    boardMove: function(move) {
      if (this.game.currentPlayer().player_id === this.player_id) {
        window.setTimeout($.proxy(function() {
            this.game.playMove(this.player_id, move);
        }, null, this), 0);
      } else {
        $.log("got move from board but wasn't my turn");
      }
    }
  });

}());
