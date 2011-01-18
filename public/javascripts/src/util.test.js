(function() {
  var U = JSG.Util;
  var Q = window.QUnit;
  JSG.Test.add(function() {
    Q.module("Util-foreach");
    Q.test("empty seq", function() {
      Q.expect(2);
      var called = false;
      var cb = function() { called = true; };
      JSG.Util.foreach({}, cb);
      Q.equals(called, false, "foreach on {} called cb");
      JSG.Util.foreach([], cb);
      Q.equals(called, false, "foreach on [] called cb");
    });
    Q.test("iterates arrays", function() {
      Q.expect(1);
      var iterated = [];
      var to_iterate = [1, "ala", false];
      JSG.Util.foreach(to_iterate, function(val) {
        iterated.push(val);
      });
      Q.deepEqual(iterated, to_iterate, "iterated == to_iterate");
    });
    Q.test("iterates objects", function() {
      Q.expect(2);
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
      Q.deepEqual(iterated_keys,
          ["key", "other-key", "number-value"],
          "iterated_keys == to_iterate");
      Q.deepEqual(iterated_values,
          ["value", "other-value", 5],
          "iterated == to_iterate");
    });
  });

  JSG.Test.add(function() {
    Q.module("Util-mix");
    Q.test("empty/same left/right obj", function() {
      var empty = {}, non_empty = {key: "value"};
      Q.deepEqual(U.mix(U.obj(empty), non_empty), non_empty);
      Q.deepEqual(U.mix(U.obj(non_empty), empty), non_empty);
      Q.deepEqual(U.mix(U.obj(empty), empty), empty);
      Q.deepEqual(U.mix(U.obj(non_empty), non_empty), non_empty);
    });
    Q.test("standart mix", function() {
      Q.deepEqual(U.mix({key: "value"}, {key2: "value2"}), {key: "value", key2: "value2"});
    });
  });

  JSG.Test.add(function() {
    Q.module("Util-extend");
    Q.test("A inherit B", function () {
      var A = function() {
        this.ca = true;
      };
      U.mix(A.prototype, {
        foo:
        function(bar) {
          this.a = bar;
        }
      });

      var B = function() {
        B.superclass.constructor.call(this);
        this.cb = true;
      };
      U.extend(B, A);
      U.mix(B.prototype, {
        foo:
        function(bar) {
          this.b = bar;
          B.superclass.foo.call(this, bar + 1);
        }
      });

      var b = new B();
      Q.ok(b.ca);
      Q.ok(b.cb);
      b.foo(5);
      Q.strictEqual(b.a, 6);
      Q.strictEqual(b.b, 5);
    });
  });
               
}());
