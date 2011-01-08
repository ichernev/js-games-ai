(function() {
  
  JSG.Util = {};

  JSG.Util.foreach = function(seq, f) {
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

}());
