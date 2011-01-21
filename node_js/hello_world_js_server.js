// Simple JS server, which runs on the local port 3002 and responds to
// everything with "Hello World").
// Run with:
// $ node hello_world_js_server.js

var http = require('http');

var server = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
});
server.listen(3002, 'localhost');
console.log('NodeJS Server running at http://localhost:3002/');
