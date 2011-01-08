(function() {
  JSG.Test.add(function() {
    module("Util-foreach");
    test("empty seq", function() {
      expect(2);
      var called = false;
      var cb = function() { called = true; };
      JSG.Util.foreach({}, cb);
      equals(called, false, "foreach on {} called cb");
      JSG.Util.foreach([], cb);
      equals(called, false, "foreach on [] called cb");
    });
    test("iterates arrays", function() {
      expect(1);
      var iterated = [];
      var to_iterate = [1, "ala", false];
      JSG.Util.foreach(to_iterate, function(val) {
        iterated.push(val);
      });
      deepEqual(iterated, to_iterate, "iterated == to_iterate");
    });
    test("iterates objects", function() {
      expect(2);
      var iterated_values = [];
      var iterated_keys = [];
      var to_iterate = {
        key: "value",
        "other-key": "other-value",
        "number-value": 5
      };
      JSG.Util.foreach(to_iterate, function(value, key) {
        iterated_keys.push(key);
        iterated_values.push(value);
      });
      deepEqual(iterated_keys,
          ["key", "other-key", "number-value"],
          "iterated_keys == to_iterate");
      deepEqual(iterated_values,
          ["value", "other-value", 5],
          "iterated == to_iterate");
    });
  });
}());
