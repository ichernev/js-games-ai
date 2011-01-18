// Simple JS server, which runs on the local port 3002 and responds to
// everything with "Hello World").
// Run with:
// $ node hello_world_js_server.js

var http = require('http');
var io = require('socket.io');

var server = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
});
server.listen(3002, "127.0.0.1");
console.log('NodeJS Server running at http://127.0.0.1:3002/');

var socket = io.listen(server);
socket.on('connection', function(client){ 
  client.on('message', function(){ console.log("message"); return 'ham'; }); 
  client.on('disconnect', function(){});
}); 
