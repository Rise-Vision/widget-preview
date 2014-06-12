"use strict";

angular.module("preview")
  .controller("fileWatchController", ["fileWatcher", "$scope", "$rootScope", "$log", function (fileWatcher, $scope, $rootScope, $log) {
    $scope.files = fileWatcher.getFiles();

    //manually trigger watch event
    $rootScope.$on('watch.file.changed', function () {
      $scope.$digest();
    });

    $rootScope.add = function (files) {
      $log.debug(files);
      if(angular.isArray(files) || files.toString() === "[object FileList]") {
        fileWatcher.add(_.pluck(files, "path"));
      }
    };

  }]);