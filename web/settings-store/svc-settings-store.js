angular.module('preview')
  .service('settingsStore', [function () {
    this.saveSettings = function (name, settings, socket) {
      socket.send(settings);
    };
  }]);