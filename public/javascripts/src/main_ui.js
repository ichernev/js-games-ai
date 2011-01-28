(function() {
  var U = JSG.Util;
  var H = U.HTML;
  
  if (!U || !H) {
    throw "sheep";
  }

  var NS = JSG.UI;

  NS.init = function() {
    var game_list = NS.GameList({
      has_desc: true,
      include_global: true,
      //bottom: NS.playButtons()
      bottom: NS.statistics()
    }, game_list_complete);
  };

  var game_list_complete = function(dom) {
    H("jsg-main").appendChild(dom);
    H("jsg-main").appendChild(H.div({ id: "main-box" }));
  };

}());
