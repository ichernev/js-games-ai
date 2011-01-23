(function() {
  var U = JSG.Util;
  var Q = window.QUnit;

  JSG.Test.add(function() {
    Q.module("Widget");
    Q.test("Ma3x", function() {
      var rows = 2, cols = 2;
      var clicked = [];
      var eventTarg = {
        cellClicked: function(m, coord) {
          Q.strictEqual(m, ma3x);
          clicked.push(coord);
        }
      };
      var ma3x = new JSG.Widgets.Ma3x(rows, cols);
      ma3x.ev.subscribe(eventTarg);
      var i, j;
      for (i = 0; i < rows; ++i) {
        for (j = 0; j < cols; ++j) {
          var cell = ma3x.cell(i, j);
          Q.ok(U.isDOM(cell));
          Q.strictEqual(cell.nodeName, "TD");
          $(cell).trigger("click");
          Q.deepEqual(clicked[clicked.length - 1], [i, j]);
        }
      }
    });
  });

}());
