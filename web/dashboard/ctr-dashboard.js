angular.module('preview')
  .controller('dashboardController', ['$scope', '$log', '$window', '$rootScope', 'fileWatcher', 'load', 'socket', 'settingsStore',
  function ($scope, $log, $window, $rootScope, fileWatcher, load, socket, settingsStore) {
    try{
      setVisible('widget-modal', false);
    } catch (err) {
      $log.error('setVisible call - ph1 - ' + err.message);
    }
    
   socket.setHandler('message', function (event) {
    var data = JSON.parse(event.data);
    $log.debug('event.data', data);
    $scope[data.name] = data.data;
   });

    console.log('onLocalProxy', load);
    $scope.onLocalProxy = load;
    
    $scope.params = '';
    $scope.additionalParams = '{}';

    angular.forEach(['settingsUrl', 'widgetUrl', 'params', 'additionalParams'],
      function (name) {
        $scope.$watch(name, function (newVal) {
          $log.debug(name, 'changed to ', newVal);
          if(newVal) {
            socket.send(JSON.stringify({
              method: 'save',
              name: name,
              data: newVal
            }));
          }
        });
      });
    

    $scope.setFile = function (type, file) {
      var path = file.files[0].path;
      $log.debug('set ' + type + ' file returns', path);
      if(path) {
        //$log.debug('Adding file to watch', path);
        //fileWatcher.add(file.files[0].path);
        $scope[type + 'Url'] = "file://" + path;
        $scope.$digest();
      }
    }

    function makeRequestHandler (id, callbackName, url, optParams) {
      $log.debug('rsmakeRequest_get url', url);      
      gadgets.io.makeRequest(url, function(data) {
        data['data'] = null;
        
        gadgets.rpc.call('if_' + id, callbackName, null, data);       
      }, optParams);
    }

    gadgets.rpc.register('rsmakeRequest_get', makeRequestHandler);


    //$scope.settingsUrl = 'file:///home/ubuntu/rangle.io/risevision/widget-weather/settings.html';
    //$scope.widgetUrl = 'file:///home/ubuntu/rangle.io/risevision/widget-weather/current.html';

    $scope.settingsUrl = '';
    $scope.widgetUrl = '';


  }]);