var http = require('http');
var io = require('socket.io');
var json = require("json");
var sys = require("sys");
var Y; require("yui3").YUI().use("*", function(ZZ) { Y = ZZ; });
var each = Y.Array.each;

var server = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
});
server.listen(3006, 'localhost');
Y.log("NodeJS remote gateway running at http://localhost:3006");

var socket = io.listen(server);

var channelClients = function() {
  var channel_clients = {};
  var client_channels = {};

  var clientToId = function(client) { return client.sessionId; };

  var subscribe = function(client, channel_id) {
    channel_clients[channel_id] = channel_clients[channel_id] || [];
    channel_clients[channel_id].push(client);

    var client_id = clientToId(client);
    client_channels[client_id] = client_channels[client_id] || [];
    client_channels[client_id].push(channel_id);
  };

  var unsubscribe = function(client, channel_id) {
    var idx;
    try {
      if ((idx = Y.Array.indexOf(channel_clients[channel_id], client)) != -1) {
        channel_clients[channel_id].splice(idx, 1);
        if (channel_clients[channel_id].length === 0) {
          delete channel_clients[channel_id];
        }
      }
    } catch (e) { Y.log(e); }

    try {
      var client_id = clientToId(client);
      if ((idx = Y.Array.indexOf(client_channels[client_id], channel_id)) != -1) {
        client_channels[client_id].splice(idx, 1);
        if (client_channels[client_id].length === 0) {
          delete client_channels[client_id];
        }
      }
    } catch (e) { Y.log(e); }
  };

  var unsubscribeAll = function(client) {
    try {
      var client_id = clientToId(client);
      Y.log("unsubscribeAll " + client_id);
      each(client_channels[client_id].slice(0), function(channel_id) {
        unsubscribe(client, channel_id);
      });
    } catch (e) { Y.log(e); }
  };

  var broadcast = function(client, msg) {
    try {
      each(client_channels[clientToId(client)], function(channel_id) {
        each(channel_clients[channel_id], function(other_client) {
          other_client.send(msg);
        });
      });
    } catch (e) { Y.log(e); }
  };

  var sendClientsInfo = function(channel_id, clientDigest) {
    try {
      var digest = [];
      each(channel_clients[channel_id], function(client) {
        digest.push(clientDigest(client));
      });
      Y.log("sending clients info: " + json.stringify(digest));
      each(channel_clients[channel_id], function(client) {
        client.send({
          _type: "clients",
          _channel_id: channel_id,
          _clients: digest
        });
      });
    }
    catch (e) { Y.log(e); }
  };

  return {
    subscribe: subscribe,
    unsubscribe: unsubscribe,
    unsubscribeAll: unsubscribeAll,
    broadcast: broadcast,
    sendClientsInfo: sendClientsInfo
  };
};

var channel_manager = channelClients();

socket.on('connection', function(client) {
  Y.log("new client connected");
  client.on('message', function(msg) { 
    Y.log("got message from client " + json.stringify(msg));
    try {
      if (msg._type === "subscribe") {
        if (msg._player_id) {
          client.player_id = msg._player_id;
        }
        channel_manager.subscribe(client, msg._channel_id);
        if (client.player_id) {
          channel_manager.sendClientsInfo(msg._channel_id, function(client) {
            return client.player_id;
          });
        }
        return;
      } else if (msg._type === "unsubscribe") {
        channel_manager.unsubscribe(client, msg._channel_id);
        return;
      } else if (msg._type === "disconnect") {
        Y.log("got disconnect request - sending it back to client");
        client.send({ _type: "disconnect" });
        // client.close();
        // client.emit("disconnect");
        // channel_manager.unsubscribeAll(client);
      }
    }
    catch (e) {
      Y.log(e);
    }
    channel_manager.broadcast(client, msg);
  });
  client.on('disconnect', function() {
    Y.log("disconnecting client");
    channel_manager.unsubscribeAll(client);
  });
});

