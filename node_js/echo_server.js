var http = require("http");
var url = require("url");
var query = require("querystring");
var json = require("json");

var tryParseJSON = function(o) {
  var parsed = {};
  for (var key in o) {
    var val = o[key];
    try {
      var obj = json.parse(val);
      parsed[key] = obj;
    }
    catch(e) {
      parsed[key] = { error: "wont parse", string: val };
    }
  }
  return parsed;
};

var server = http.createServer(function(req, res) {
  var parsedUrl = url.parse(req.url, true);
  req.setEncoding("utf8");
  (function() {
    var whole_body = "";
    req.on("data", function(chunk) {
      whole_body += chunk;
    });
    req.on("end", function() {
      resp.body = tryParseJSON(query.parse(whole_body));
      res.end(json.stringify(resp, null, 4));
    });
  }());
  var resp = {
    pathname: parsedUrl.pathname,
    search: parsedUrl.search,
    headers: req.headers,
    method: req.method
  };
  res.writeHead(200, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
  });
  resp.query_params = tryParseJSON(parsedUrl.query);
  // res.end(json.stringify(resp, null, 4));
});

var port = 3005;
server.listen(port, 'localhost');
console.log('NodeJS Server running at http://localhost:' + port + '/');
