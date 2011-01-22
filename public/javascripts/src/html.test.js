(function() {
  var Q = window.QUnit;
  var U = JSG.Util;
  var H = U.HTML;
  JSG.Test.add(function() {
    Q.module("HTML");
    Q.test("plain object", function() {
      var div = H.div();
      Q.ok(U.isDOM(div));
      Q.strictEqual(div.nodeName, "DIV");
      Q.strictEqual(div.firstChild, null);
      Q.deepEqual(div.attributes.length, 0);
    });
    Q.test("one object attributes", function() {
      var div = H.div({
          id: "my-div",
          cls: "my-class",
          css: {
            width: "50px",
            height: "50px"
          }
      }), jq = $(div);
      Q.strictEqual(div.nodeName, "DIV");
      Q.strictEqual(div.firstChild, null);
      Q.strictEqual(jq.attr("id"), "my-div");
      Q.ok(jq.hasClass("my-class"));
      Q.strictEqual(jq.css("width"), "50px");
      Q.strictEqual(jq.css("height"), "50px");
    });
    Q.test("object with event handlers", function() {
      Q.expect(2);
      var div = H.div({
          onclick: function(e) {
            Q.ok(true);
          }
      }),
          jq = $(div), Obj, obj;
      jq.trigger("click");

      Obj = function() { this.a = "a"; };
      U.mix(Obj.prototype, {
        handler: function(e) {
          Q.strictEqual(this.a, "a");
        }
      });
      obj = new Obj();
      div = H.div({
          context: obj,
          onclick: obj.handler
      });
      jq = $(div);
      jq.trigger("click");
    });
    Q.test("object with text node", function() {
      var str = "foo is <div><span>hoo</span></div> ><>> &lt;",
          div = H.div(str),
          jq = $(div);
      Q.notStrictEqual(div.firstChild, null);
      Q.strictEqual(div.firstChild.nodeType, document.TEXT_NODE);
      Q.strictEqual(div.firstChild.nodeValue, str);
    });
    Q.test("remove", function() {
      var inner,
          div = H.div(inner = H.div());
      Q.strictEqual(div.firstChild, inner);
      Q.strictEqual(inner.firstChild, null);
      Q.strictEqual(inner.parentNode, div);
      H.remove(inner);
      Q.strictEqual(div.firstChild, null);
      Q.strictEqual(inner.parentNode, null);
    });
    Q.test("empty", function() {
      var in1, in2,
          div = H.div(in1 = H.div("ala"), in2 = H.div("bala"), "text");
      Q.strictEqual(div.firstChild, in1);
      Q.strictEqual(div.childNodes[1], in2);
      Q.strictEqual(in2.nextSibling.nodeType, document.TEXT_NODE);
      H.empty(div);
      Q.strictEqual(in1.parentNode, null);
      Q.strictEqual(in2.parentNode, null);
      Q.strictEqual(div.firstChild, null);
    });
  });
}());
