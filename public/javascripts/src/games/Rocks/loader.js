(function() {
  JSG.Util.loadGameData(
      "Rocks", [
        "game.js",
        "board.js",
        "board_ui.js",
        "perfect_ai.js"
      ], [
        "board.css"
      ], [
        "no_rock.png",
        "selected_rock.png",
        "unselected_rock.png"
      ]);

  // var game_name = "Rocks";
  // var dir_builder = function(resource, fn) {
  //   return "/" + resource + (resource !== "images" ? "/games/" : "/") + game_name + "/" + fn;
  // };
  // // var base_js_dir = "/javascripts/src/games/" + game_name + "/";
  // var js_files = [
  //   "game.js",
  //   "board.js",
  //   "board_ui.js"
  //   // "perfect_ai.js"
  // ];

  // JSG.Util.getManyScripts(
  //     js_files.map(function(fn) { return dir_builder("javascripts/src", fn); }),
  //     function() {
  //       $.log("files loaded, firing event");
  //       JSG.ev.fire("gameFilesLoaded", game_name);
  //     });

  // // var base_css_dir = "/stylesheets/games/" + game_name + "/";
  // var css_files = [
  //   "board.css"
  // ];
  // JSG.Util.foreach(css_files, function(fn) {
  //   JSG.Util.getCSS(dir_builder("stylesheets", fn));
  // });

  // var img_files = [
  //   "no_rock.png",
  //   "selected_rock.png",
  //   "unselected_rock.png"
  // ];

  // var img = new window.Image();
  // JSG.Util.foreach(img_files, function(fn) {
  //   img.src = dir_builder("images", fn);   
  // });

}());
