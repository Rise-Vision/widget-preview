
var express = require('express');
var sockjs = require('sockjs');
var url = require('url');
var request = require('request');

var app = express(); // better instead

var store = {
  params: '',
  additionalParams: ''
};

var log = function(msg1, msg2, msg3, msg4) {
  console.log("Server: ", msg1, msg2, msg3, msg4);
}

var subscribers = [];

app.get('/gadgets/makeRequest', function (req, res) {
  if (!req.query.url) {
    res.send(400, "URL parameter is requried");
  }
  else {
    var url = req.query.url;
    var responseString = "throw 1; < don't be evil' >";

    request(url, function (err, response, body) {
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

app.use('/local/*', function (req, res) {
  var path = req.params[0];
  res.sendfile(path);
});

app.use('/', express.static('web/'));

function parseUrl(type) {
  if(type === 'widgetUrl' || type === 'settingsUrl' && store[type]) {
    store[type + 'Parsed'] = url.parse(store[type]);
  }
}

var data = sockjs.createServer();
data.on('connection', function(conn) {
  subscribers.push(conn);
  log('Connected & subscribed.');
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
      var changed = false;

      if(store[message.name] !== message.data) {
        //data has actually changed.
        changed = true;
        store[message.name] = message.data;
      }

      parseUrl(message.name);

      if(changed) {
        //propagate the change
        for (var i = 0; i < subscribers.length; i++) {
          if(subscribers[i] && subscribers[i] !== conn) {
            subscribers[i].write(JSON.stringify({
              name: message.name,
              data: store[message.name]
            }));;
          }
        };  
      }
      
    }
  });
  conn.on('close', function() {
    log('Connection closed.');
    var index;
    if((index = subscribers.indexOf(conn)) >= 0) {
      subscribers.splice(index, 1);
    }
  });
});

var server = require('http').createServer(app);
data.installHandlers(server, {prefix:'/data'});

server.listen(8000);