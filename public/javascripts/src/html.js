(function() {
  var U = JSG.Util;

  // Returns a dom element.
  // -- if obj is string then it is used as DOM id;
  // -- if obj is array of DOM elements, return a document fragment containing them;
  // -- if obj is a DOM element - return obj.
  var H = U.HTML = function(obj) {
    if (U.isString(obj)) {
      return document.getElementById(obj);
    } else if (U.isDOM(obj)) {
      return obj;
    } else if ($.isArray(obj)) {
      var doc_frag = document.createDocumentFragment();
      U.foreach(obj, function(dom) {
        doc_frag.appendChild(dom);
      });
      return doc_frag;
    } else {
      return undefined;
    }
  };

  var tags = [
      "h1", "h2", "h3", "h4", "h5", "h6",
      "hr", "br",
      "em", "strong", 
      "div", "span", "a", "img",
      "form", "input", "button", "select", "option", "textarea", "label",
      "ol", "ul", "li",
      "dl", "dt", "dd",
      "pre",
      "table", "colgroup", "thead", "tbody", "tfoot", "th", "tr", "td", "col",
      "link"
  ];

  var snake2camel = function(name) {
    return name.replace(/_(.)/g, function(_, letter) {
      return letter.toUpperCase();
    });
  };

  U.foreach(tags, function(tag) {
    H[tag] = function() {
      var dom = document.createElement(tag);
      var jq = $(dom);

      var processArgument = function(arg) {
        if (arg === null || arg === undefined) {
          // Skip null & undefined.
          return;
        }
        if (U.isString(arg)) {
          dom.appendChild(H.txtNode(arg));
        } else if (U.isDOM(arg)) {
          dom.appendChild(arg);
        } else if ($.isArray(arg)) {
          U.foreach(arg, processArgument);
        } else if ($.isFunction(arg)) {
          processArgument(arg());
        } else {
          // Assume arg is a hash of attributes.
          var context = null;
          U.foreach(arg, function(arg_val, arg_key) {
            if (arg_key === "context") {
              context = arg_val;
            } else if (arg_key === "cls") {
              U.foreach(arg_val.split(" "), function(cls) {
                jq.addClass(cls);
              });
            } else if (arg_key === "css" || arg_key === "style") {
              U.foreach(arg_val, function(css_val, css_key) {
                // dom.style[snake2camel(css_key)] = css_val;
                jq.css(snake2camel(css_key), css_val);
              });
            } else if (U.startsWith(arg_key, "on")) {
              jq.bind(arg_key.slice(2), context ? $.proxy(arg_val, null, context) : arg_val);
            } else {
              jq.attr(arg_key, arg_val);
            }
          });
        }
      };
      U.foreach(U.toA(arguments), processArgument);

      return dom;
    };
  });

  var tags_c_shortcut = [ "div", "span" ];
  U.foreach(tags_c_shortcut, function(tag) {
    H["c" + tag] = function() {
      var args = U.toA(arguments);
      var cls = args[0];
      args[0] = { cls: cls };
      return H[tag].apply(H, args);
    };
  });

  U.foreach(tags_c_shortcut, function(tag) {
    H["i" + tag] = function() {
      var args = U.toA(arguments);
      var id = args[0];
      args[0] = { id: id };
      return H[tag].apply(H, args);
    };
  });

  H.txtNode = function(text) {
    return document.createTextNode(text);
  };

  H.remove = function(dom) {
    dom.parentNode.removeChild(dom);
  };

  H.empty = function(dom) {
    for (var crnt_child = dom.firstChild, next_child;
        crnt_child !== null;
        crnt_child = next_child) {
      next_child = crnt_child.nextSibling;
      crnt_child.parentNode.removeChild(crnt_child);
    }
  };

  H.text = function(dom, text) {
    H.empty(dom);
    dom.appendChild(H.txtNode(text));
  };

  H.updateTdImage = function(td, img_src, size) {
    if (!img_src) {
      H.empty(td);
      return;
    }
    var img_dom = td.firstChild;
    if (!img_dom) {
      img_dom = H.img({
        src: img_src,
        width: size[0],
        height: size[1]
      });
      td.appendChild(img_dom);
    } else if (!(new RegExp(img_src)).test(img_dom.src)) {
      img_dom.src = img_src;
    }
  };
}());
