// All urls in this file are relative to the 'public' directory of the project.
(function() {
  
  var U = JSG.Util = {};

  // Use this function to iterate over arrays and hashes.
  // The first argument passed to f is the value, the second is the key (index).
  U.foreach = function(seq, f, context) {
    var res;
    if ($.isArray(seq)) {
      for (var i = 0, l = seq.length; i < l; ++i) {
        res = f.call(context, seq[i], i);
        if (res !== undefined) {
          break;
        }
      }
    } else {
      for (var key in seq) {
        if (seq.hasOwnProperty(key)) {
          res = f.call(context, seq[key], key);
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

  U.keys = function(obj) {
    var keys = [];
    U.foreach(obj, function(_, key) {
      keys.push(key);
    });
    return keys;
  };

  U.vals = function(obj) {
    var vals = [];
    U.foreach(obj, function(val) {
      vals.push(val);
    });
    return vals;
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

  U.startsWith = function(str, pref) {
    return str.slice(0, pref.length) === pref;
  };

  U.endsWith = function(str, suff) {
    return str.slice(str.length - suff.length) === suff;
  };

  // Returns weather the argument is a string object.
  U.isString = function(str) {
    return typeof str === "string";
  };

  // Returns weather the argument is a DOM object.
  U.isDOM = function(dom) {
    return dom.nodeType !== undefined && dom.nextSibling !== undefined;
  };

  U.iota = function(length) {
    var res = [];
    for (var i = 0; i < length; ++i) {
      res.push(i);
    }
    return res;
  };

  U.count = function(arr, el) {
    var res = 0;
    U.foreach(arr, function(ael) {
      res += ael === el ? 1 : 0;
    });
    return res;
  };

  U.pow = function(base, power) {
    if (power === 0) {
      return 1;
    }
    return power % 2 ? U.pow(base, power - 1) * base :
        U.pow(base * base, power / 2);
  };

  U.div = function(nom, den) {
    return (nom - (nom % den)) / den;
  };

  U.randElement = function(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  };

  U.fill = function(arr, el, len) {
    len = len === undefined ? arr.length : len;
    var nopushlen = U.min(len, arr.length);
    var i;
    for (i = 0; i < nopushlen; ++i) {
      arr[i] = el;
    }
    for (i = nopushlen; i < len; ++i) {
      arr.push(el);
    }
    return arr;
  };

  U.max = function(a, b) {
    return a > b ? a : b;
  };

  U.min = function(a, b) {
    return a < b ? a : b;
  };

  U.minElement = function(arr) {
    if (arr.length === 0) { return undefined; }
    var min = arr[0];
    U.foreach(arr, function(el) {
      min = U.min(min, el);
    });
    return min;
  };

  U.maxElement = function(arr) {
    if (arr.length === 0) { return undefined; }
    var max = arr[0];
    U.foreach(arr, function(el) {
      max = U.max(max, el);
    });
    return max;
  };

  U.getCSS = function(url) {
    $("head").append(JSG.Util.HTML.link({
      href: url,
      type: "text/css",
      rel: "stylesheet",
      media: "screen"
    }));
  };

  U.getManyScripts = function(urls, cb) {
    var script_count = urls.length;
    var script_loaded = function() {
      -- script_count;
      if (script_count === 0) {
        cb();
      }
    };
    U.foreach(urls, function(url) {
      $.getScript(url, script_loaded);
    });
  };

  U.loadGame = function(game_name, cb) {
    if (JSG.Games[game_name]) {
      $.log("game " + game_name + " already loaded");
      cb();
      return;
    }
    // Like public/games/Rocks/js/loader.js
    var loader_url = "/games/" + game_name + "/js/loader.js";
    $.log("loading loader " + loader_url);
    $.getScript(loader_url);
    var listener = {
      gameFilesLoaded: function(loaded_game_name) {
        $.log("got sources for: " + loaded_game_name);
        if (loaded_game_name === game_name) {
          $.log("notifying callback");
          cb();
          JSG.ev.unsubscribe(listener);
        }
      }
    };
    JSG.ev.subscribe(listener);
  };

  U.loadGameData = function(game_name, js, css, img) {
    var resource_url_for = function(res) {
      if (res === "js") {
        // Like public/games/Rocks/js/board.js
        return function(fn) { return "/games/" + game_name + "/js/" + fn; };
      } else if (res === "css") {
        // Like public/games/Rocks/css/board.css
        return function(fn) { return "/games/" + game_name + "/css/" + fn; };
      } else if (res === "img") {
        // Like public/games/Rocks/images/selected_rock.png
        return function(fn) { return "/games/" + game_name + "/images/" + fn; };
      }
    };
    U.getManyScripts(
        js.map(resource_url_for("js")),
        function() {
          JSG.ev.fire("gameFilesLoaded", game_name);
        });
    U.foreach(
        css.map(resource_url_for("css")),
        U.getCSS);
    U.foreach(
        img.map(resource_url_for("img")),
        (function() {
          var img_obj = new window.Image();
          return function(fn) {
            img_obj.src = fn;
          };
        }()));
  };

}());
