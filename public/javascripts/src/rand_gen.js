(function() {
  var U = JSG.Util;

  var x = 2147483629;
  var y = 2147483587;
  var z = 2147483647;

  U.RandGen = function(seed) {
    this.seed = seed;
  };

  U.mix(U.RandGen.prototype, {
    increment: function() {
      return this.seed = (this.seed * x + y) % z;
    },
    randInt: function(a, b) {
      this.increment();
      if (b === undefined) {
        return this.seed % a;
      } else {
        return a + this.seed % (b - a);
      }
    }
  });
}());
