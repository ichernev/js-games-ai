(function() {
  var U = JSG.Util;
  var H = U.HTML;
  
  var NS = JSG.Games.Nim = JSG.Games.Nim || {};

  NS.Board = function() {
    this.ui = new NS.BoardUI();
    this.subscribe(this.ui);

    this.locked = true;
    this.move = undefined;
    this.ui.button.disabled = true;

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
      if (this.game.state[pos[0]][pos[1]] === 0) {
        return;
      }
      // discard clicking within selected buttons
      if (this.move === undefined) {
        this.move = pos;
        this.toggleStones(pos, "selected_stone");
      } else if (this.move[0] === pos[0] && this.move[1] === pos[1]) {
        this.move = undefined;
        this.toggleStones(pos, "unselected_stone");
      }
      this.recalcButtonState();
    },

    recalcButtonState: function() {
      var enable = this.game.validMove(this.move);
      this.ui.button.disabled = !enable;
    },

    buttonClicked: function() {
      this.ev.fire("boardMove", this.move);
      this.move = undefined;
      this.recalcButtonState();
    },

    toggleStones: function(move, pic) {
      var i;
      if (this.game.current_player_idx === 0) {
        for (i = move[1];
             this.game.state[move[0]][i] === 1 && i >= 0;
             --i) {
          this.ui.setImg([move[0], i], pic);
        }
      } else {
        for (i = move[1];
             this.game.state[move[0]][i] === 1 && i < NS.Game.stones;
             ++i) {
          this.ui.setImg([move[0], i], pic);
        }
      }
    },

    displayMove: function(_, move) {
      var i, j;
      for (i = 0; i < NS.Game.stones; ++i) {
        for (j = 0; j < NS.Game.stones; ++j) {
          this.ui.setImg([i, j], this.game.state[i][j] === 0 ? "no_stone" : "unselected_stone");
        }
      }
    }

  });

}());
