angular.module("preview")
  .service("fileWatcher", ["$rootScope", "$log", function ($rootScope, $log){
    "use strict";

    var self = this;
    this._files = [];

    this.launchExternal = true;

    this.getFiles = function () {
      return self._files;
    };

    this.add = function(source) {
      var changed = false;
      if(angular.isArray(source)) { //array of file case
        angular.forEach(source, function (file) {
          self._files.push(file);
          if(!changed) {
            changed = true;
          }
        });
      }
      else { //single file
        self._files.push(source);
        $rootScope.$emit("watch.file.added", source);
        $log.debug("watch.file.added", source);
        changed = true;
      }

      if(changed) {
        $rootScope.$emit("watch.file.changed");
        $log.debug("watch.file.changed");
      }
      
    };

  }]);