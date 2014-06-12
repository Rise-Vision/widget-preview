angular.module('preview', ['ngRoute'])
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

    $routeProvider

    .when('/preview/:view_type', {
      templateUrl: 'viewer/viewer.html',
      controller: 'viewerController', 
      resolve: {
      }
    })

    .when('/', {
      templateUrl: 'dashboard/dashboard.html',
      controller: 'dashboardController', 
      resolve: {
        load: function($q, $window, $location) {
          var deferred = $q.defer();
          if ($window.location.protocol !== 'file:') {
            $location.path('/no-access');
          } else { // fire $routeChangeError

            loadScript('../server.js', function () {
              deferred.resolve();
            });  
          }
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
      return require('./components/lodash/dist/lodash.js');
    }
    else {
      return $window._;
    }
  }
);