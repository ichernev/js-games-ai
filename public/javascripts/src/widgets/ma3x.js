(function() {
  var U = JSG.Util;
  var H = U.HTML;

  JSG.Widgets = JSG.Widgets || {};
  JSG.Widgets.Ma3x = function(rows, cols) {
    this.dom = H.table(this.tbody = H.tbody());
    this.ev = new U.Event();

    var i, j;
    for (i = 0; i < rows; ++i) {
      var crow = H.tr();
      for (j = 0; j < cols; ++j) {
        (function(i, j) {
          crow.appendChild(H.td({
            context: this,
            onclick: function() {
              this.ev.fire("cellClicked", this, [i, j]);
            }
          }));
        }.call(this, i, j));
      }
      this.tbody.appendChild(crow);
    }
  };
  
  U.mix(JSG.Widgets.Ma3x.prototype, {
    // Pass (x, y) or ([x, y])
    cell: function() {
      var pos = arguments.length == 2 ? U.toA(arguments) : arguments[0];
      return this.tbody.rows[pos[0]].cells[pos[1]];
    }
  });
}());
