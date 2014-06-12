var express = require('express');

var server = express(); // better instead

server.get('/gadgets/makeRequest', function (req, res) {
  if (!req.query.url) {
    res.send(400, "URL parameter is requried");
  }
  else {
    var url = req.query.url;
    var responseString = "throw 1; < don't be evil' >";

    request(url, function (err, response, body) {

      console.log(response);

      var obj = {};

      obj[url] = {
        body: response.body,
        DataHash: "",
        rc: response.statusCode
      };

      responseString += JSON.stringify(obj);
      res.end(responseString);
    });

  }
});



server.get('/', function (req, res) {
  res.send('<html><body><ul><li><a href="index.html#/preview/widget">/#/preview/widget</a></li>'+
    '<li><a href="/index.html#/preview/settings">/#/preview/settings</a></li></ul></body></html>');
});

server.use(express.static('web/'));
server.listen(8000);