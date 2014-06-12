var express = require('express');
var sockjs = require('sockjs');

var app = express(); // better instead

var store = {
  params: '',
  additionalParams: ''
};

var subscribers = [];

app.get('/gadgets/makeRequest', function (req, res) {
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

app.use(express.static('/home/ubuntu/rangle.io/risevision/widget-preview/web/'));


var data = sockjs.createServer();
data.on('connection', function(conn) {
  subscribers.push(conn);
  console.log('Connected & subscribed.');
  conn.on('data', function(message) {
    message = JSON.parse(message);
    if(message.method === 'get') {

      var numSubscribers = subscribers.length;
      conn.write(JSON.stringify({
        name: message.name,
        data: store[message.name]
      }));
    }
    else if (message.method === 'save') {
      store[message.name] = message.data;

      for (var i = 0; i < subscribers.length; i++) {
        if(subscribers[i] && subscribers[i] !== conn) {
          subscribers[i].write(JSON.stringify({
            name: message.name,
            data: store[message.name]
          }));;
        }
      };
    }
  });
  conn.on('close', function() {
    console.log('Connection closed.');
    var index;
    if((index = subscribers.indexOf(conn)) >= 0) {
      subscribers.splice(index, 1);
    }
  });
});

var server = require('http').createServer(app);
data.installHandlers(server, {prefix:'/data'});

server.listen(8000);