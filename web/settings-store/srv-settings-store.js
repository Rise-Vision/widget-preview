angular.module('preview')
  .service('settingsStore', ['socket', function (socket) {
    this.saveSettings = function (settings) {
      socket.send(settings);
    };
  }]);