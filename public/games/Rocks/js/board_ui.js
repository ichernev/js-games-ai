(function() {
  var U = JSG.Util;
  var H = U.HTML;

  var NS = JSG.Games.Rocks = JSG.Games.Rocks || {};
  var css_pref = "rocks_";
  var img_root = "/games/Rocks/images/";

  NS.BoardUI = function(rocks) {
    this.rocks = rocks;
    this.ma3x = new JSG.Widgets.Ma3x(1, this.rocks);
    this.subscribe(this.ma3x);
    this.dom = H.div(this.ma3x.dom);
    $(this.dom).addClass(css_pref + "board");
    // Put rocks in every cell.
    var i;
    for (i = 0; i < this.rocks; ++i) {
      this.setImg(i, "unselected_rock");
    }
    // Put a button to play the current move.
    this.dom.appendChild(this.button = H.button("play this move", {
      context: this,
      onclick: this.buttonClicked
    }));

    this.ev = new U.Event();
  };

  U.mix(NS.BoardUI.prototype, U.EventTarget);
  U.mix(NS.BoardUI.prototype, {
    setImg: function(pos, img_name) {
      var td = this.ma3x.cell([0, pos]);
      H.updateTdImage(td, img_name && img_root + img_name + ".png", [30, 30]);
    },

    cellClicked: function(m, pos) {
      this.ev.fire("cellClicked", pos);
    },

    buttonClicked: function() {
      this.ev.fire("buttonClicked");
    }

  });

}());
