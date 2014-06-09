angular.module("preview", [])
  .controller("mainController", ["$scope", "$log", "$window", "$rootScope", function ($scope, $log, $window, $rootScope) {
    try{
      setVisible('ph1', false);
    } catch (err) {
      $log.error('setVisible call - ph1 - ' + err.message);
    }

    $scope.settingsUrl = "https://s3.amazonaws.com/Widget-Weather/settings.html";
    $scope.params = "";
    $scope.additionalParams = "";

    function getAdditionalParams() {
      return $scope.additionalParams;
    }

    function closeSettings () {
      destroyElement("sc0_pre0_ph1", "ph1");
    }

    function extractParamsSuffixFromUrl(url) {
      var parser = document.createElement('a');
      parser.href = url;
      $log.debug("params", parser.search);
      return parser.search;
    }

    function extractFullPathFromUrl(url) {
      var parser = document.createElement('a');
      parser.href = url;
      var fullPath = parser.protocol + "//" + parser.host + parser.pathname;
      $log.debug("fullPath", fullPath);
      return fullPath;
    }

    function saveSettings (data) {
      $scope.widgetUrl = extractFullPathFromUrl(data.params);
      $scope.additionalParams = data.additionalParams;
      $scope.params = extractParamsSuffixFromUrl(data.params);
      $scope.$apply();
      closeSettings();
    }

    function makeRequestHandler (id, callbackName, url, optParams) {
      $log.debug('rsmakeRequest_get url', url);      
      gadgets.io.makeRequest(url, function(data) {
        data['data'] = null;
        
        gadgets.rpc.call('if_' + id, callbackName, null, data);       
      }, optParams);
    }

    gadgets.rpc.register('rscmd_getAdditionalParams', getAdditionalParams);
    gadgets.rpc.register('rscmd_saveSettings', saveSettings);
    gadgets.rpc.register('rscmd_closeSettings', closeSettings);
    gadgets.rpc.register('rsmakeRequest_get', makeRequestHandler);

    $scope.showWidget = function (url) {
      $log.info('showing widget');
      try {
        updateGadgetWrapper('ph1', 'sc0_pre0_ph1', 0, 0, 'none');
      } catch (err) {
        $log.error('updateGadgetWrapper call - sc0_pre0_ph1 - '
            + err.message);
      }

      try {
        var widgetUrl =url + $scope.params + ($scope.params.indexOf("?") === -1 ? "?" : "&" )
            + 'up_id=sc0_pre0_ph1_0w&up_rsW=522&up_rsH=228'
            + '&parent=' + encodeURIComponent($window.location.origin);
        $log.debug('widgetUrl', widgetUrl);
        updateWidget(
          widgetUrl,'sc0_pre0_ph1', 'sc0_pre0_ph1_0w', 'none');
      } catch (err) {
        $log.error('updateWidget call - sc0_pre0_ph1 - ' + err.message);
      }

      try{
        setVisible('ph1', true);
      } catch (err) {
        $log.error('setVisible call - ph1 - ' + err.message);
      }
    };

  }]);