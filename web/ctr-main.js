angular.module("preview")
  .controller("mainController", ["$scope", "$log", "$window", "$rootScope", "fileWatcher",
  function ($scope, $log, $window, $rootScope, fileWatcher) {
    try{
      setVisible('widget-modal', false);
    } catch (err) {
      $log.error('setVisible call - ph1 - ' + err.message);
    }

    $scope.settingsUrl = "http://s3.amazonaws.com/Widget-World-Clock/settings.html";
    $scope.widgetUrl = "http://s3.amazonaws.com/Widget-World-Clock/world-clock.html";
    $scope.params = "";
    $scope.additionalParams = "";

    function getAdditionalParams() {
      return $scope.additionalParams;
    }

    $scope.closeSettings = function () {
      destroyElement("sc0_pre0_ph1", "ph1");
      setVisible('widget-modal', false);
      $log.debug("Dialog closed.");
    }

    $scope.setWidgetFile = function (file) {
      $log.debug('setWidgetFile returns', file.files[0]);
      if(file.files[0].path) {
        $log.debug('Adding file to watch', file.files[0].path);
        fileWatcher.add(file.files[0].path);
      }
    }

    function extractParamsSuffixFromUrl(url) {
      if (isValidUrl(url)) {
        var parser = document.createElement('a');
        parser.href = url;
        $log.debug("params", parser.search);
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
        var fullPath = parser.protocol + "//" + parser.host + parser.pathname;
        $log.debug("fullPath", fullPath);
        return fullPath;
      }
      else {
        return "";
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
      $log.debug("Settings save data", data);
      var newWidgetUrl = extractFullPathFromUrl(data.params);
      if(newWidgetUrl) {
        $scope.widgetUrl = newWidgetUrl;
      }
      $scope.additionalParams = data.additionalParams;
      $scope.params = extractParamsSuffixFromUrl(data.params);
      $scope.$digest();
      $scope.closeSettings();
    }

    function getParams (param, id) {
      $log.debug("getParams", param, id);
      if (param === "additionalParams"){
        return getAdditionalParams();
      }
      else return "";
    }

    function makeRequestHandler (id, callbackName, url, optParams) {
      $log.debug('rsmakeRequest_get url', url);      
      gadgets.io.makeRequest(url, function(data) {
        data['data'] = null;
        
        gadgets.rpc.call('if_' + id, callbackName, null, data);       
      }, optParams);
    }

    function itemLoaded (id) {
      $log.debug("itemLoaded", id);
    }

    $scope.play = function () {
      playCmd("sc0_pre0_ph1_0w");
    }

    gadgets.rpc.register('rscmd_getAdditionalParams', getAdditionalParams);
    gadgets.rpc.register('rscmd_saveSettings', saveSettings);
    gadgets.rpc.register('rscmd_closeSettings', $scope.closeSettings);
    gadgets.rpc.register('rsmakeRequest_get', makeRequestHandler);
    gadgets.rpc.register('rsparam_get', getParams);
    gadgets.rpc.register('rsevent_loaded', itemLoaded);
    gadgets.rpc.register('rsevent_ready', itemReady);

    $scope.showWidget = function (url) {
      $log.info('showing widget');

      updateGadgetWrapper('ph1', 'sc0_pre0_ph1', 0, 0, 'none');

      try {
        var widgetUrl =url + ($scope.params.indexOf("?") === -1 ?  "?" : "" ) 
            + $scope.params
            + 'up_id=sc0_pre0_ph1_0w&up_rsW=522&up_rsH=228'
            + '&parent=' + encodeURIComponent($window.location.origin);
        $log.debug('widgetUrl', widgetUrl);
        updateWidget(
          widgetUrl,'sc0_pre0_ph1', 'sc0_pre0_ph1_0w', 'none');
      } catch (err) {
        $log.error('updateWidget call - sc0_pre0_ph1 - ' + err.message);
      }

      try{
        setVisible('widget-modal', true);
      } catch (err) {
        $log.error('setVisible call - ph1 - ' + err.message);
      }
    };

  }]);