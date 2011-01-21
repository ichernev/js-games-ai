var http = require("http");
var url = require("url");
var json = require("json");

var server = http.createServer(function(req, res) {
  var parsedUrl = url.parse(req.url, true);
  var resp = {
    pathname: parsedUrl.pathname,
    search: parsedUrl.search,
    headers: req.headers,
    method: req.method
  };
  res.writeHead(200, {
      "Content-Type": "application/json"
  });
  var newQuery = {}
  for (var key in parsedUrl.query) {
    var val = parsedUrl.query[key];
    try {
      var obj = json.parse(val);
      newQuery[key] = obj;
    }
    catch(e) {
      newQuery[key] = val;
    }
  }
  resp.query_params = newQuery;
  res.end(json.stringify(resp, null, 4));
});

var port = 3005;
server.listen(port, 'localhost');
console.log('NodeJS Server running at http://localhost:' + port + '/');
