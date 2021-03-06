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

  JSG.Test.add(function() {
    Q.module("Util-erase");
    Q.test("erase present element", function() {
      Q.expect(6);
      var arr = [1, "ala", true];
      Q.ok(U.erase(arr, "ala"));
      Q.deepEqual(arr, [1, true]);
      Q.ok(U.erase(arr, 1));
      Q.deepEqual(arr, [true]);
      Q.ok(U.erase(arr, true));
      Q.deepEqual(arr, []);
    });

    Q.test("erase nonexistant element", function() {
      var arr = [1, "ala", true];
      Q.ok(!U.erase(arr, 10));
      Q.deepEqual(arr, [1, "ala", true]);
    });
  });

  JSG.Test.add(function() {
    Q.module("Util-Events");
    Q.test("simple fire", function() {
      var A = function() {
        this.ev = new U.Event();
      };
      U.mix(A.prototype, {
        fire:
        function() {
          this.ev.fire("foo", 5, "five");
        }
      });

      var B = function(a) {
        this.a = a;
        this.subscribe(this.a);
      };
      U.mix(B.prototype, U.EventTarget);
      U.mix(B.prototype, {
        foo:
        function() {
          Q.strictEqual(arguments.length, 2);
          Q.strictEqual(arguments[0], 5);
          Q.strictEqual(arguments[1], "five");
        }
      });

      Q.expect(3);
      var a = new A();
      var b = new B(a);
      a.fire();
    });
  });
               
  JSG.Test.add(function() {
    Q.module("Util-misc");
    Q.test("keys", function() {
      var obj = {
        key1: "val1",
        key2: "val2"
      };
      Q.deepEqual(U.keys(obj), ["key1", "key2"]);
      Q.deepEqual(U.keys({}), []);
      Q.deepEqual(U.keys({1: "a"})[0], "1");
    });
    Q.test("vals", function() {
      var obj0, obj = {
        key1: "val1",
        key2: obj0 = { key3: "val3" }
      };
      Q.deepEqual(U.vals(obj), ["val1", obj0]);
      Q.deepEqual(U.vals({}), []);
    });
    Q.test("iota", function() {
      Q.deepEqual(U.iota(0), []);
      Q.deepEqual(U.iota(1), [0]);
      Q.deepEqual(U.iota(5), [0, 1, 2, 3, 4]);
    });
    Q.test("startsWith", function() {
      Q.ok(U.startsWith("alabala", "ala"));
      Q.ok(U.startsWith("alabala", ""));
      Q.ok(U.startsWith("alabala", "alabala"));
      Q.ok(!U.startsWith("alabala", "alabala "));
      Q.ok(!U.startsWith("", "ala"));
      Q.ok(!U.startsWith("ala", "ba"));
    });
    Q.test("endsWith", function() {
      Q.ok(U.endsWith("alabala", ""));
      Q.ok(U.endsWith("alabala", "a"));
      Q.ok(U.endsWith("alabala", "la"));
      Q.ok(U.endsWith("alabala", "alabala"));
      Q.ok(!U.endsWith("alabala", "zala"));
      Q.ok(!U.endsWith("alabala", " alabala"));
      Q.ok(!U.endsWith("", "alabala"));
    });
    Q.test("isString", function() {
      Q.ok(U.isString(""));
      Q.ok(U.isString("foo"));
      Q.ok(!U.isString({}));
      Q.ok(!U.isString({foo: "foo"}));
      Q.ok(!U.isString([]));
      Q.ok(!U.isString(["foo"]));
      Q.ok(!U.isString(!function() {}));
    });
    Q.test("isDOM", function() {
      Q.ok(U.isDOM(document.createTextNode("foo is the new bar")));
      Q.ok(U.isDOM(document.createElement("div")));
      Q.ok(!U.isDOM($(document.createElement("div"))));
      Q.ok(!U.isDOM([]));
      Q.ok(!U.isDOM({}));
      Q.ok(!U.isDOM("foo"));
      Q.ok(!U.isDOM(function() {}));
    });
    Q.test("randElement", function() {
      var tests = 100000;
      var arr = U.iota(10);
      var freq = U.fill([], 0, 10);
      for (var i = 0; i < tests; ++i) {
        ++ freq[U.randElement(arr)];
      }
      var maxEl = U.maxElement(freq),
          minEl = U.minElement(freq);
      var bad = (maxEl - minEl) / minEl;
      Q.ok(bad < 0.1);
    });
    Q.test("minElement", function() {
      Q.strictEqual(U.minElement([1,2,3]), 1);
      Q.strictEqual(U.minElement([3,2,1]), 1);
      Q.strictEqual(U.minElement([]), undefined);
      Q.strictEqual(U.minElement([2,1,3]), 1);
      Q.strictEqual(U.minElement([1]), 1);
      Q.strictEqual(U.minElement([1, 1]), 1);
    });
    Q.test("maxElement", function() {
      Q.strictEqual(U.maxElement([1,2,3]), 3);
      Q.strictEqual(U.maxElement([3,2,1]), 3);
      Q.strictEqual(U.maxElement([]), undefined);
      Q.strictEqual(U.maxElement([2,1,3]), 3);
      Q.strictEqual(U.maxElement([1]), 1);
      Q.strictEqual(U.maxElement([1, 1]), 1);
    });
    Q.test("fill:standard", function() {
      Q.deepEqual(U.fill([], 4, 3), [4, 4, 4]);
      Q.deepEqual(U.fill([1,2,3,4], 0, 2), [0, 0, 3, 4]);
      Q.deepEqual(U.fill([1,2], 0, 4), [0, 0, 0, 0]);
    });
    Q.test("fill:same array returned", function() {
      var arr = [1,2,3];
      Q.strictEqual(U.fill(arr, 0, 5), arr);
      arr = [];
      Q.strictEqual(U.fill(arr, 0, 5), arr);
      arr = U.iota(10);
      Q.strictEqual(U.fill(arr, 0, 5), arr);
    });
  });

  JSG.Test.add(function() {
    Q.module("Util-math");
    Q.test("pow", function() {
      Q.strictEqual(U.pow(5, 0), 1);
      Q.strictEqual(U.pow(5, 1), 5);
      Q.strictEqual(U.pow(5, 2), 25);
      Q.strictEqual(U.pow(2, 10), 1024);
      Q.strictEqual(U.pow(2, 13), 8192);
    });
    Q.test("div", function() {
      Q.strictEqual(U.div(5, 2), 2);
      Q.strictEqual(U.div(4, 2), 2);
      Q.strictEqual(U.div(5, 1), 5);
      Q.strictEqual(U.div(14, 5), 2);
      Q.strictEqual(U.div(15, 5), 3);
    });
  });
}());
