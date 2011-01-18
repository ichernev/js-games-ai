(function() {
  
  var U = JSG.Util = {};

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

}());
