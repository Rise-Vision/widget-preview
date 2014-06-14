angular.module('preview')
  .controller('viewerController', ['socket', '$scope', '$log', 'type', '$window', function (socket, $scope, $log, type, $window) {

    $scope.params = '';
    $scope.additionalParams = '';
    $scope[type + 'Url'] = '';

     socket.setHandler('message', function (event) {
      var data = JSON.parse(event.data);
      $log.debug('event.data', data);
      $scope[data.name] = data.data;
     });

     $scope.$on('$destroy', function () {
      $log.debug('Closed');
      socket.close();
     });

    function getAdditionalParams() {
      $log.debug('getAdditionalParams called', $scope.additionalParams);
      return $scope.additionalParams;
    }

    function getParam (paramName, id) {
      $log.debug('getParam called', paramName, id);
      if (paramName === 'additionalParams'){
        return getAdditionalParams();
      }
      else {
        return '';
      }
    }

    function extractParamsSuffixFromUrl(url) {
      if (isValidUrl(url)) {
        var parser = document.createElement('a');
        parser.href = url;
        $log.debug('params', parser.search);
        return parser.search;
      }
      else {
        return url;
      }
    }

    function extractFullPathFromUrl(url) {
      if (isValidUrl(url)) {
        var parser = document.createElement('a');
        parser.href = url;
        var fullPath = parser.protocol + '//' + parser.host + parser.pathname;
        $log.debug('fullPath', fullPath);
        return fullPath;
      }
      else {
        return '';
      }
    }

    function isValidUrl (str) {
      var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
      if(!pattern.test(str)) {
        return false;
      } else {
        return true;
      }
    }


    function saveSettings (data) {
      $log.debug('Settings save data', data);
      var newWidgetUrl = extractFullPathFromUrl(data.params);
      if(newWidgetUrl) {
        $scope.widgetUrl = newWidgetUrl;
        socket.send(JSON.stringify({
          method: 'save',
          name: 'widgetUrl',
          data: $scope.widgetUrl
        }));
      }
      $scope.additionalParams = data.additionalParams;
      $scope.params = extractParamsSuffixFromUrl(data.params);
      $scope.$digest();
      alert('Settings saved.');
    }


    function itemLoaded (id) {
      $log.debug('itemLoaded', id);
    }


    function itemReady(id, canPlay, canStop, canPause, canReportReady, canReportDone) {
      //parent.itemReady(presFrame, id, canPlay, canStop, canPause, canReportReady, canReportDone);

      //triggerEvent("gadgetReady", id);
      $scope.canPlay = canPlay;
      $scope.canStop = canStop;
      $scope.canPause = canPause;
      $scope.canReportReady = canReportReady;
      $scope.canReportDone = canReportDone;

      $scope.play();
    }

    $scope.closeSettings = function () {
      try {
        destroyElement('sc0_pre0_ph1', 'ph1');
        setVisible('widget-modal', false);
        $log.debug('Dialog closed.');
      }
      catch(e) {}
    };


    $scope.showWidget = function (url) {
      $log.info('showing widget', url);
      $scope.showed = true;
      if(url.indexOf('file://') === 0) {
        url = 'http://localhost:8000/local/' + url.substring(7);
      }

      updateGadgetWrapper('ph1', 'sc0_pre0_ph1', 0, 0, 'none');
      //try {
        var widgetUrl = url + ($scope.params.indexOf('?') === -1 ?  '?' : '' ) +
            $scope.params + ($scope.params.length === 0 ?  '?' : '&' ) + 
            'up_id=sc0_pre0_ph1_0w&up_rsW=522&up_rsH=228' +
            '&parent=' + encodeURIComponent($window.location.origin);
        $log.debug('URL', widgetUrl);
        updateWidget(
          widgetUrl,'sc0_pre0_ph1', 'sc0_pre0_ph1_0w', 'none');
      //} catch (err) {
      //  $log.error('updateWidget call - sc0_pre0_ph1 - ' + err.message);
      //}

      try{
        setVisible('widget-modal', true);
      } catch (err) {
        $log.error('setVisible call - ph1 - ' + err.message);
      }
    };

    $scope.play = function () {
      if($scope.canPlay) {
        playCmd('sc0_pre0_ph1_0w');        
      }
    }

    $scope.pause = function () {
      if($scope.canPause) {
        pauseCmd('sc0_pre0_ph1_0w');        
      }
    }

    $scope.stop = function () {
      if($scope.canStop) {
        stopCmd('sc0_pre0_ph1_0w');        
      }
    }

    $scope.$watch(type + 'Url', function (newVal, oldVal) {
      $scope.url = newVal;
    });


    $scope.$watch('url', function (newVal, oldVal) {
      $log.debug('Url changed to' + newVal);
      if(newVal && oldVal) {
        $window.location.reload();
      }
      else if(newVal) {
        $log.debug('Showing widget', newVal);
        $scope.showWidget(newVal);
      }
    });

    angular.forEach(['params', 'additionalParams'],
      function (name) {
        $scope.$watch(name, function (newVal) {
          $log.debug(name, 'changed to ', newVal);
          if(newVal) {
            if(type === 'settings') {
             socket.send(JSON.stringify({
                method: 'save',
                name: name,
                data: newVal
              }));
            }
          }
        });
      });
    
    gadgets.rpc.register('rscmd_saveSettings', saveSettings);
    gadgets.rpc.register('rscmd_getAdditionalParams', getAdditionalParams);
    gadgets.rpc.register('rsevent_loaded', itemLoaded);
    gadgets.rpc.register('rsevent_ready', itemReady);
    gadgets.rpc.register('rsparam_get', function(id, param) {
      var value = getParam(param, id);
      gadgets.rpc.call('if_' + id, 'rsparam_set_' + id, null, param, value);
    });

    gadgets.rpc.register('rscmd_closeSettings', $scope.closeSettings);
    gadgets.rpc.register('rsmakeRequest_get', function(id, callbackName, url, optParams) {
      gadgets.io.makeRequest(url, function(data) {
        data['data'] = null;
        
        gadgets.rpc.call('if_' + id, callbackName, null, data);       
      }, optParams);
    });

     socket.send(JSON.stringify({method: 'get', name: 'params'}));
     socket.send(JSON.stringify({method: 'get', name: 'additionalParams'}));
     socket.send(JSON.stringify({method: 'get', name: type + 'Url'}));

  }]);