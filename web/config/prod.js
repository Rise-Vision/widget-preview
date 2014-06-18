angular.module('preview')
  .config(function($provide) {
    $provide.decorator('$log', ['$delegate', function($delegate) {

          $delegate.debug = function() { };
          $delegate.info = function() { };

          return $delegate;
      }]);
  });
