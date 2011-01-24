(function() {
  var U = JSG.Util;
  var H = U.HTML;
  
  var NS = JSG.Games.Rocks = JSG.Games.Rocks || {};

  NS.Board = function() {
    this.ui = new NS.BoardUI();
    this.subscribe(this.ui);

    this.locked = true;
    this.move = [];

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
      if (0 !== pos[0]) {
        throw "Illegal board click";
      }
      var erased = U.erase(this.move, pos[1]);
      if (erased) {
        this.ui.setImg(pos[1], "unselected_rock");
      } else {
        this.move.push(pos[1]);
        this.ui.setImg(pos[1], "selected_rock");
      }
    },

    buttonClicked: function() {
      this.ev.fire("boardMove", this.move);
      this.move = [];
    },

    displayMove: function(_, move) {
      U.foreach(move, function(m) {
        this.ui.setImg(m, "no_rock");
      }, this);
    }

  });

}());
