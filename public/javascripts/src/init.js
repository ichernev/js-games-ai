if (JSG === undefined) {
  var JSG = {
    UI: {},
    Games: {},
    GameCore: {},
    Data: {},
    Daemons: {}
  };

  JSG.completeInit = function() {
    JSG.ev = new JSG.Util.Event();
    JSG.Daemons.play_manager = new JSG.GameCore.PlayManager();

    if (JSG.Util.HTML("jsg-main")) {
      JSG.UI.init();
    }
  };
}
