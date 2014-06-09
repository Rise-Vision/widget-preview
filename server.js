var express = require('express');
var request = require('request');

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
server.use(express.static(__dirname + '/web'));

server.listen(8000);