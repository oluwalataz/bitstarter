var express = require('express');

var app = express.createServer(express.logger());

var fs = require('fs');

app.get('/', function(request, response) {
  var content = false;
  try {
     
      content = fs.readFileSync(__dirname+'/'+'index.html', 'utf-8');
  } catch (err) {
} 
  response.send(content);
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
