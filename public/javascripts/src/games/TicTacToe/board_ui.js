(function() {
  var U = JSG.Util;
  var H = U.HTML;

  var NS = JSG.Games.TicTacToe = JSG.Games.TicTacToe || {};
  var css_pref = "tictactoe_";
  var img_root = "/images/TicTacToe/";

  NS.BoardUI = function() {
    this.ma3x = new JSG.Widgets.Ma3x(NS.Game.rows, NS.Game.cols);
    this.subscribe(this.ma3x);
    this.dom = this.ma3x.dom;
    $(this.dom).addClass(css_pref + "board");

    this.ev = new U.Event();
  };

  U.mix(NS.BoardUI.prototype, U.EventTarget);
  U.mix(NS.BoardUI.prototype, {
    setImg: function(pos, img_name) {
      var td = this.ma3x.cell(pos);
      H.empty(td);
      if (!img_name) { return; }
      td.appendChild(H.img({
        src: img_root + img_name + ".png",
        width: 30,
        height: 30
      }));
    },

    cellClicked: function(m, pos) {
      this.ev.fire("cellClicked", pos);
    }
  });

  NS.BoardUI._test = function() {
    var img_names = ["circle", "cross"];
    var BoardManager = function() {
      this.ui = new NS.BoardUI();
      this.subscribe(this.ui);
      this.crnt_img_id = 0;

      H("jsg-main").appendChild(this.ui.dom);
    };
    U.mix(BoardManager.prototype, U.EventTarget);
    U.mix(BoardManager.prototype, {
      cellClicked: function(pos) {
        this.ui.setImg(pos, img_names[this.crnt_img_id]);
        this.crnt_img_id = (this.crnt_img_id + 1) % 2;
      }
    });

    var bm = new BoardManager();
  };


}());
