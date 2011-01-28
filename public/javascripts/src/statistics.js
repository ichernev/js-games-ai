(function() {
  var U = JSG.Util;
  var H = U.HTML;

  var NS = JSG.UI;

  NS.statistics = function() {
    var stats = {
      "most_games": "Number of games played",
      "best_total_score": "Points won",
      "best_avg_score": "Average score",
      "max_time_played": "Time spent playing",
      "fastest_players_avg": "Average game time"
    };

    var loadStat = function(name, game) {
      var make_addr = function(name, game) {
        game = game ? game + "/" : "";
        return JSG.Data.RAILS + "stats/" + game + name + ".json";
      };
      $.getJSON(make_addr(name, game), handleStat(name));
    };

    var handleStat = function(name) {
      return function(stat) {
        var table = H.table({ id: "statistics" },
            H.tr(
              H.th("Rank"),
              H.th("Name"),
              H.th(stats[name])));
        
        U.foreach(stat, function(user, ix) {
            table.appendChild(H.tr(
              H.td((ix + 1).toString()),
              H.td(user.display_name),
              H.td(user.field)));
        });
        var main_box = H("stat-box");
        H.empty(main_box);
        main_box.appendChild(table);
      };
    };

    var makeLinks = function(game) {
      var link = function(name) {
        return H.li(
            H.a(stats[name], {
              onclick: function() { loadStat(name, game); }
            }));
      };
      return H.ul({ cls: "ctl" }, U.keys(stats).map(link));
    };

    return makeLinks;
  };

}());
