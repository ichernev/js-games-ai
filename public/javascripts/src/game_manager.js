(function() {
  var U = JSG.Util;
  var H = U.HTML;
  var JSON = window.JSON;

  JSG.GameCore.gameManager = function() {
    var type;
    var game_name;
    var player_ids;
    var instance_id;
    var active;
    var socket;

    var playLocal = function(game_name_, player_ids_) {
      type = "local";
      player_ids = player_ids_;
      game_name = game_name_;
      newGame();
    };

    var playRemote = function(game_name_, local_player_id) {
      type = "remote";
      game_name = game_name_;
      // Find a remote user.
      socket = new io.Socket("localhost", { port: 3006 });
      socket.on("connect", function() {
        $.log("subscribing to channel " + game_name);
        socket.send({
          _type: "subscribe", 
          _channel_id: game_name,
          _player_id: local_player_id
        });
      });
      socket.on("message", function(data) {
        $.log(["got message from socket", data]);
        if (data._type === "clients" && data._clients.length === 2) {
          data._clients.sort();
          if (data._clients[0] === local_player_id) {
            $.log("we are active");
            active = true;
            player_ids = data._clients;
            newGame();
          } else {
            $.log("we are passive");
            active = false;
          }
        } else if (data._type === "disconnect") {
          // Now it is safe to disconnect.
          socket.disconnect();
        } else if (!active && data.instance_id) {
          $.log(["got instance id from active player", data.instance_id]);
          instance_id = data.instance_id;
          socket.disconnect();
          playGame();
        }
      });
      socket.on("disconnect", function() {
        $.log("yeey - disconnected from socket");
      });
      socket.connect();
    };

    var playAI = function(game_name_, player_id, ai_player_id) {
      game_name = game_name_;
      player_ids = [player_id];
      if (ai_player_id === undefined) {
        $.getJSON("http://localhost:3000/game/" + game_name + "/ai.json", handleAI);
      } else {
        player_ids.push(ai_player_id);
        newGame();
      }
    };

    var handleAI = function(data) {
      if (!data.status) {
        $.log(["error with ai call", data.message]);
        return;
      }
      if (data.ai.length < 1) {
        $.log(["could not find ai for game", game_name]);
        return;
      }
      // Choosing the first ai (normally ai should be chosen in the game list).
      player_ids.push(data.ai[0].player_id);
      newGame();
    };

    var newGame = function() {
      $.log(["sending new game with player_ids", player_ids]);
      $.ajax({
          type: "POST",
          url: "http://localhost:3000/game/" + game_name + "/new.json",
          dataType: "json",
          data: { players: JSON.stringify(player_ids) },
          success: handleNew
      });
    };

    var handleNew = function(data) {
      if (!data.status) {
        $.log(["error with new game", data.message]);
        return;
      }
      instance_id = data.instance_id;
      if (type === "remote" && active) {
        $.log("sending instance_id to passive player", socket);
        socket.send({
          instance_id: instance_id
        });
        // TODO(iskren): I really don't know what.
        socket.send({
          _type: "disconnect"
        });
        // socket.disconnect();
      }
      $.log("got instance id", instance_id, active);
      playGame();
    };

    var playGame = function() {
      if (!instance_id) {
        $.log("no instance id, use new first");
        return;
      }

      $.getJSON(
          "http://localhost:3000/game/play.json",
          {
            instance_id: instance_id
          },
          handlePlay);
    };

    var handlePlay = function(data) {
      if (!data.status) {
        $.log(["error with play game", data]);
        return;
      }
      $.log(["got data for play", data]);
      JSG.GameCore.startGame(data);
    };

    return {
      playLocal: playLocal,
      playRemote: playRemote,
      playAI: playAI
    };
  };

}());
