(function() {
  var U = JSG.Util;
  var H = U.HTML;
  
  if (!U || !H) {
    throw "sheep";
  }

  var NS = JSG.UI;

  NS.init = function() {
    H("jsg-main").appendChild(
      H.idiv("tabs-main",
        H.ul(
          H.li(H.a({ href: "#tab-play" }, "play")),
          H.li(H.a({ href: "#tab-stats" }, "stats"))),
        H.idiv("tab-play"),
        H.idiv("tab-stats")));

    $("#tabs-main").tabs();

    NS.GameList({
      has_desc: true,
      include_global: false,
      //include_global: true,
      bottom: NS.playButtons()
      //bottom: NS.statistics()
    }, play_game_list_complete);

    NS.GameList({
      has_desc: false,
      include_global: true,
      bottom: NS.statistics()
    }, stat_game_list_complete);
  };

  var play_game_list_complete = function(dom) {
    H("tab-play").appendChild(dom);
    H("tab-play").appendChild(H.div({ id: "play-box", cls: "ui-state-default" }));
    H("tab-play").appendChild(H.br({ clear: "both" }));
  };

  var stat_game_list_complete = function(dom) {
    H("tab-stats").appendChild(dom);
    H("tab-stats").appendChild(H.div({ id: "stat-box", cls: "ui-state-default" }));
    H("tab-stats").appendChild(H.br({ clear: "both" }));
  };

}());
