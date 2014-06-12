var NwBuilder = require('node-webkit-builder');
var gulp = require('gulp');
var gutil = require('gulp-util');
var run = require('gulp-run');

gulp.task('build', function (callback) {

    var nw = new NwBuilder({
      files: ['bootstrapper.html', 'web/**', "server.js", "package.json", 
        "node_modules/request/**",
        "mode_modules/express/**",
        "node_modules/sockjs/**"
        ],
      platforms: ['linux32', 'osx']
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

gulp.task('default', ['build']);
