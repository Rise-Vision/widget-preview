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
      return $scope.additionalParams;
    }

    function getParams (param, id) {
      $log.debug('getParams', param, id);
      if (param === 'additionalParams'){
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
      }
      $scope.additionalParams = data.additionalParams;
      $scope.params = extractParamsSuffixFromUrl(data.params);
      $scope.$digest();
      alert('Settings saved.');
    }


    function itemLoaded (id) {
      $log.debug('itemLoaded', id);
    }

    gadgets.rpc.register('rscmd_saveSettings', saveSettings);
    gadgets.rpc.register('rscmd_getAdditionalParams', getAdditionalParams);
    gadgets.rpc.register('rsevent_loaded', itemLoaded);
    gadgets.rpc.register('rsevent_ready', itemReady);
    gadgets.rpc.register('rsparam_get', getParams);

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
        url = 'http://localhost:8000/local' + url.substring(7);
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
      playCmd('sc0_pre0_ph1_0w');
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
    


   socket.send(JSON.stringify({method: 'get', name: 'params'}));
   socket.send(JSON.stringify({method: 'get', name: 'additionalParams'}));
   socket.send(JSON.stringify({method: 'get', name: type + 'Url'}));

  }]);