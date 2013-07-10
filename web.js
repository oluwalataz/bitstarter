var express = require('express');

var app = express.createServer(express.logger());

var fs = require('fs');

app.get('/', function(request, response) {
  var buffer = new Buffer(8);
  var fl = fs.readFile('hello.html', function (err, data) {
   if (err) throw err;
   buffer.write(data, 'utf-8');
});
  response.send(fl);
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
