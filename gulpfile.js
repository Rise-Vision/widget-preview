var NwBuilder = require('node-webkit-builder');
var gulp = require('gulp');
var gutil = require('gulp-util');
var bump = require('gulp-bump');

gulp.task('build', function (callback) {

    var nw = new NwBuilder({
      files: ['web/**', 'server.js', 'package.json',
        'node_modules/request/**',
        'node_modules/express/**',
        'node_modules/sockjs/**'
        ],
      platforms: ['linux32', 'osx', 'win']
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

// Defined method of updating:
// Semantic
gulp.task('bump', function(){
  gulp.src(['./package.json', './bower.json'])
  .pipe(bump({type:'patch'}))
  .pipe(gulp.dest('./'));
});

gulp.task('default', ['build']);
