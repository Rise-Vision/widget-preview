var NwBuilder = require('node-webkit-builder');
var gulp = require('gulp');
var gutil = require('gulp-util');

gulp.task('build', function (callback) {

    var nw = new NwBuilder({
      files: ['nwapp/**', 'web/**'],
      platforms: ['linux32']
    });

    // Log stuff you want
    nw.on('log', function (mgs) {
      gutil.log('node-webkit-builder', mgs);
    });

    // Build retruns a promise
    nw.build(function (err) {
      if(err) {
          gutil.log('node-webkit-builder', err);
      }
      callback();
      gutil.beep();
    });
});