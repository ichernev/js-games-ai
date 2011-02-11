(function() {
  var U = JSG.Util;
  var H = U.HTML;
  
  var NS = JSG.Games.Nim = JSG.Games.Nim || {};

  NS.Board = function(game) {
    this.game = game;
    this.ui = new NS.BoardUI(this.game.conf.piles, this.game.conf.max_pile);
    this.subscribe(this.ui);

    this.locked = true;
    this.move = undefined;
    this.ui.button.disabled = true;

    this.ev = new U.Event();

    // This will take the initial game state and display it on the board.
    this.displayMove();
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
      if (this.move !== undefined) {
        this.toggleStones(this.move, "unselected_stone");
      }
      this.move = pos;
      this.toggleStones(pos, "selected_stone");
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
             this.game.state[move[0]][i] === 1 && i < this.game.conf.max_pile;
             ++i) {
          this.ui.setImg([move[0], i], pic);
        }
      }
    },

    displayMove: function(_, move) {
      var i, j;
      for (i = 0; i < this.game.conf.piles; ++i) {
        for (j = 0; j < this.game.conf.max_pile; ++j) {
          this.ui.setImg([i, j], this.game.state[i][j] === 0 ? "no_stone" : "unselected_stone");
        }
      }
    }

  });

}());
