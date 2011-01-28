(function() {
  JSG.Util.loadGameData(
      "TicTacToe", [
        "game.js",
        "board.js",
        "board_ui.js",
        "perfect_ai.js"
      ], [
        "board.css"
      ], [
        "cross.png",
        "circle.png"
      ]);

  // var game_name = "TicTacToe";
  // var base_js_dir = "/javascripts/src/games/" + game_name + "/";
  // var js_files = [
  //   "game.js",
  //   "board.js",
  //   "board_ui.js",
  //   "perfect_ai.js"
  // ];

  // JSG.Util.getManyScripts(
  //     js_files.map(function(fn) { return base_js_dir + fn; }),
  //     function() {
  //       $.log("files loaded, firing event");
  //       JSG.ev.fire("gameFilesLoaded", game_name);
  //     });

  // var base_css_dir = "/stylesheets/games/" + game_name + "/";
  // var css_files = [
  //   "board.css"
  // ];
  // JSG.Util.foreach(css_files, function(fn) {
  //   JSG.Util.getCSS(base_css_dir + fn);
  // });

}());
