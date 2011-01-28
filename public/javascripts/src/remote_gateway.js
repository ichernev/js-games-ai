(function () {
  var U = JSG.Util;
  var H = U.HTML;
  var JSON = window.JSON;

  var NS = JSG.GameCore;
  NS.RemoteGateway = function(players_info, game) {
    this.players_info = players_info;
    this.game = game;
    this.subscribe(this.game);

    // Open communication with nodejs using game.instance_id.
    this.createGameConnection(game.instance_id);
  };

  U.mix(NS.RemoteGateway.prototype, U.EventTarget);
  U.mix(NS.RemoteGateway.prototype, {

    createGameConnection: function(instance_id) {
      this.socket = new io.Socket(
          JSG.Data.DOMAIN, { port: JSG.Data.NODE_PORT });
      this.socket.on("connect", $.proxy(this, "connected"));
      this.socket.on("message", $.proxy(this, "receivedRawData"));
      this.socket.on("disconnect", $.proxy(this, "disconnected"));
      this.socket.connect();
    },

    connected: function() {
      $.log("connected");
      this.socket.send({
        _type: "subscribe",
        _channel_id: this.game.instance_id
      });
    },

    receivedRawData: function(data) {
      $.log(["got message", data]);
      this.receivePlayerMove(data.player_id, data.move);
    },

    send: function(data) {
      $.log(["sending data", data]);
      this.socket.send(data);
    },

    disconnected: function() {
      $.log("disconnected");
    },

    // Game event.
    playerMove: function(player, move) {
      if (this.players_info[player.player_id].type === "LocalUser") {
        this.send({player_id: player.player_id, move: move});
      }
    },

    // Game event.
    gameOver: function() {
      this.socket.disconnect();
    },

    receivePlayerMove: function(player_id, move) {
      if (this.players_info[player_id].type === "RemoteUser") {
        window.setTimeout($.proxy(function() {
          this.game.playMove(player_id, move);
        }, null, this), 0);
      }
    }
  
  });
}());
