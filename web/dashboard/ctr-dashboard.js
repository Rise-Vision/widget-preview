angular.module('preview')
  .controller('dashboardController', ['$scope', '$log', '$window', '$rootScope', 'fileWatcher', 'load', 'socket', 'settingsStore',
  function ($scope, $log, $window, $rootScope, fileWatcher, load, socket, settingsStore) {
    try{
      setVisible('widget-modal', false);
    } catch (err) {
      $log.error('setVisible call - ph1 - ' + err.message);
    }

    console.log('load', load);

    $scope.params = '';
    $scope.additionalParams = '';

    angular.forEach(['settingsUrl', 'widgetUrl'],
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
    

    $scope.setWidgetFile = function (file) {
      $log.debug('setWidgetFile returns', file.files[0]);
      if(file.files[0].path) {
        $log.debug('Adding file to watch', file.files[0].path);
        fileWatcher.add(file.files[0].path);
        $scope.widgetUrl = file.files[0].path;
      }
    }

    function makeRequestHandler (id, callbackName, url, optParams) {
      $log.debug('rsmakeRequest_get url', url);      
      gadgets.io.makeRequest(url, function(data) {
        data['data'] = null;
        
        gadgets.rpc.call('if_' + id, callbackName, null, data);       
      }, optParams);
    }

    gadgets.rpc.register('rscmd_closeSettings', $scope.closeSettings);
    gadgets.rpc.register('rsmakeRequest_get', makeRequestHandler);


    $scope.settingsUrl = 'http://s3.amazonaws.com/Widget-World-Clock/settings.html';
    $scope.widgetUrl = 'http://s3.amazonaws.com/Widget-World-Clock/world-clock.html';

  }]);