(function() {
  var U = JSG.Util;
  var H = U.HTML;
  
  var NS = JSG.Games.TicTacToe = JSG.Games.TicTacToe || {};

  NS.Board = function() {
    this.ui = new NS.BoardUI();
    this.subscribe(this.ui);

    this.locked = true;

    this.ev = new U.Event();
  };

  U.mix(NS.Board.prototype, U.EventTarget);
  U.mix(NS.Board.prototype, {

    lock: function() {
      this.locked = true;
    },

    unlock: function() {
      this.locked = false;
    },

    // Events from BoardUI.
    cellClicked: function(pos) {
      if (this.locked) { return; }
      this.ev.fire("boardMove", pos);
    },

    displayMove: function(who, move) {
      this.ui.set_img(move, this.token_map[who]);
    }

  });

  NS.Board._test = function() {
    var board = new NS.Board();
    var eventTarg = {
      boardMove: function(move) {
        $.log(["got move", move]);
        board.lock();
        $.log("locking");
        window.setTimeout(function() {
          $.log("unlocking");
          board.unlock();
        }, 5000);
      }
    };
    board.ev.subscribe(eventTarg);
    $.log("unlocking");
    board.unlock();
  };

}());
