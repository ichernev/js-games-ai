if (JSG === undefined) {
  var JSG = {
    UI: {},
    Games: {},
    GameCore: {},
    Data: {},
    Daemons: {}
  };

  JSG.Data.DOMAIN = "localhost";
  JSG.Data.RAILS = "http://localhost:3000/";
  JSG.Data.NODE_PORT = 3006;
  
  JSG.completeInit = function() {
    JSG.ev = new JSG.Util.Event();
    JSG.Daemons.play_manager = new JSG.GameCore.PlayManager();

    if (JSG.Util.HTML("jsg-main")) {
      JSG.UI.init();
    }
  };
}
