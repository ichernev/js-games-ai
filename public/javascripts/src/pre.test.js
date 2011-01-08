(function() {
  JSG.Test = {
    tests: [],
    add: function(cb) {
      this.tests.push(cb);
    },
    flush: function() {
      JSG.Util.foreach(this.tests, function(cb) { cb(); });
      this.tests = [];
    }
  };
}());
