var express = require('express');

var app = express.createServer(express.logger());

var fs = require('fs');
var buffer = new Buffer(128);

app.get('/', function(request, response) {
  var content = false;
  try {
     
      content = fs.readFileSync(__dirname+'/'+'index.html', 'utf8');
      buffer.write(content);
  } catch (err) {
} 
  response.send(buffer.toString('ascii'));
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
