// Simple JS server, which runs on the local port 3002 and responds to
// everything with "Hello World").
// Run with:
// $ node hello_world_js_server.js

var http = require('http');
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('Hello World\n');
}).listen(3002, "127.0.0.1");
console.log('NodeJS Server running at http://127.0.0.1:3002/');

