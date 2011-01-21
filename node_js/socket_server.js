var http = require('http');
var io = require('socket.io');

var server = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
});
server.listen(3002, 'localhost');
console.log('NodeJS Server running at http://localhost:3002/');

var socket = io.listen(server);
var clients = [];
socket.on('connection', function(client) {
  clients.push(client);
  var interval = setInterval(function() {
    client.send('This is a message from the server!  ' + new Date().getTime());
  }, 5000);
  client.on('message', function(event) { 
    console.log('Received message from a client!', event);
    notifyClients(clients, event);
  });
  client.on('disconnect', function() {
    clearInterval(interval);
    console.log('Server has disconnected');
  });
});

var notifyClients = function(clients, event) {
  var i;
  for (i = 0; i < clients.length; i++) {
    clients[i].send('echo ' + event);
  }
};
