angular.module('preview', ['ngRoute', 'bd.sockjs'])
  .config(['$routeProvider', function ($routeProvider) {
    function loadScript(sScriptSrc, oCallback) {
      var oHead = document.getElementsByTagName('head')[0];
      var oScript = document.createElement('script');
      oScript.type = 'text/javascript';
      oScript.src = sScriptSrc;
      // most browsers
      oScript.onload = oCallback;
      // IE 6 & 7
      oScript.onreadystatechange = function() {
        if (this.readyState === 'complete') {
          oCallback();
        }
      };
      oHead.appendChild(oScript);
    }

    var loadScriptDeferred;

    $routeProvider

    .when('/preview/:view_type', {
      templateUrl: 'viewer/viewer.html',
      controller: 'viewerController', 
      resolve: {
        socket: function ($q, socketFactory, $log) {
          var deferred = $q.defer();
          var socket = socketFactory({
            url: 'http://localhost:8000/data'
          });
          socket.setHandler('open', function () {
            $log.debug('Websocket connection opened.');
            deferred.resolve(socket);
          });
          return deferred.promise;
        },
        type: function ($route) {
          return $route.current.params.view_type;
        }
      }
    })

    .when('/', {
      templateUrl: 'dashboard/dashboard.html',
      controller: 'dashboardController', 
      resolve: {
        load: function($q, $window) {
          loadScriptDeferred = $q.defer();
          if ($window.location.protocol !== 'file:') {
            loadScriptDeferred.resolve(true);
            //$location.path('/no-access');
          } else { // fire $routeChangeError
            loadScript('../server.js', function () {
              window.onbeforeunload = function(){
                server.close();
              };
              loadScriptDeferred.resolve(false);
            });
          }
          return loadScriptDeferred.promise;
        },
        socket: function ($q, socketFactory, $log) {
          var deferred = $q.defer();
          
          loadScriptDeferred.promise.then(function () {
            var socket = socketFactory({
              url: 'http://localhost:8000/data'
            });
            socket.setHandler('open', function () {
              $log.debug('Websocket connection opened.');
              deferred.resolve(socket);
            });
          });
          return deferred.promise;
        }
      }
    })

    .when('/no-access', {
      templateUrl: 'no-access.html'
    })

  .otherwise({redirectTo: '/'});
}])
  
  .value('_', function ($window) {
    if($window.location.protocol === 'file:') {
      return require('./components/underscore/underscore.js');
    }
    else {
      return $window._;
    }
  });