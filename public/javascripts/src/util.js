(function() {
  
  var U = JSG.Util = {};

  // Use this function to iterate over arrays and hashes.
  // The first argument passed to f is the value, the second is the key (index).
  U.foreach = function(seq, f) {
    var res;
    if ($.isArray(seq)) {
      for (var i = 0, l = seq.length; i < l; ++i) {
        res = f(seq[i], i);
        if (res !== undefined) {
          break;
        }
      }
    } else {
      for (var key in seq) {
        if (seq.hasOwnProperty(key)) {
          res = f(seq[key], key);
          if (res !== undefined) {
            break;
          }
        }
      }
    }
    return res;
  };

  // Puts all own properties of b in a (overriding same keys).
  U.mix = function(a, b) {
    U.foreach(b, function(val, key) {
      a[key] = val;
    });
    return a;
  };

  // Creates a new object with prototype proto.
  U.obj = function(proto) {
    var F = function() {};
    F.prototype = proto;
    return new F;
  };


  // r extends s (oop means).
  U.extend = function(r, s) {
    var sp = s.prototype, rp = U.obj(sp);
    r.prototype = rp;

    rp.constructor = r;
    r.superclass = sp;

    // assign constructor property
    if (s != Object && sp.constructor == Object.prototype.constructor) {
      $.log("setting constructor");
      sp.constructor = s;
    }

    return r;
  };

  // Use this function to convert arguments to a real js array.
  U.toA = function(args) {
    return Array.prototype.slice.call(args, 0);
  };

  // Erase the given obj from arr.
  // -- only the first occurrence is erased
  // -- returns false if nothing was erased
  U.erase = function(arr, obj) {
    var idx = U.foreach(arr, function(el, i) {
      if (el === obj) { return i; }
    });
    if (idx !== undefined) {
      // Erasing that index.
      arr.splice(idx, 1);
      return true;
    }
    return false;
  };

  // Returns weather the argument is a string object.
  U.isString = function(str) {
    return typeof str === "string";
  };

  // Returns weather the argument is a DOM object.
  U.isDOM = function(dom) {
    return dom.nodeType !== undefined && dom.nextSibling !== undefined;
  };

}());
