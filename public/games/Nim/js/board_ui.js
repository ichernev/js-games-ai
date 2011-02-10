(function() {
  var U = JSG.Util;
  var H = U.HTML;

  var NS = JSG.Games.Nim = JSG.Games.Nim || {};
  var css_pref = "nim_";
  var img_root = "/games/Nim/images/";

  NS.BoardUI = function() {
    this.ma3x = new JSG.Widgets.Ma3x(NS.Game.stones, NS.Game.stones);
    this.subscribe(this.ma3x);
    this.dom = H.div(this.ma3x.dom);
    $(this.dom).addClass(css_pref + "board");
    // Put stone in every cell.
    var i, j;
    for (i = 0; i < NS.Game.stones; ++i) {
      for (j = 0; j < NS.Game.stones; ++j) {
        this.setImg([i, j], "unselected_stone");
      }
    }
    // Put a button to play the current move.
    this.dom.appendChild(this.button = H.button("take these stones", {
      context: this,
      onclick: this.buttonClicked
    }));
    // $(H.button("play this move")).click($.proxy(this, "buttonClicked")).appendTo(this.dom);
    // $(H.button("play this move")).click($.proxy(this.buttonClicked, null, this)).appendTo(this.dom);

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
    },

    buttonClicked: function() {
      this.ev.fire("buttonClicked");
    }

  });

}());
