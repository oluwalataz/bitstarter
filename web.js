var express = require('express');

var app = express.createServer(express.logger());

var fs = require('fs');
var content = false;

app.get('/', function(request, response) {
  fs.readFile(__dirname+'/'+'index.html', 'utf8', function (errr, data) {
    if (!err) {
      content = data;
  }});
  response.send(content);
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
