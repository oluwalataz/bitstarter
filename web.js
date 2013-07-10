var express = require('express');

var app = express.createServer(express.logger());

var fs = require('fs');
var buffer = new Buffer(8);

var fl = fs.readFile('index.html', function (err, data) {
   if (err) throw err;
   buffer.write(data, 'utf-8');
});

app.get('/', function(request, response) {
  response.send(fl);
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
