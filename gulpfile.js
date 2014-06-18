'use strict';

/*jshint node: true */

var env = process.env.NODE_ENV || 'dev';
var NwBuilder = require('node-webkit-builder');
var gulp = require('gulp');
var gutil = require('gulp-util');
var bump = require('gulp-bump');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
var gutil = require('gulp-util');
var fs = require('fs');

gulp.task('config', function() {
  gulp.src(['./web/config/' + env + '.js'])
    .pipe(rename('config.js'))
    .pipe(gulp.dest('./web/config'));
});

gulp.task('clean', function() {
  return gulp.src('build/**/*', {read: false})
    .pipe(clean({force: true}));
});

gulp.task('save-version', function () {
  var json = require('./package.json');
  if(!json.version) {
    throw 'No version specified in package.json';
  }
  else {
    fs.writeFileSync('build/VERSION', json.version);
  }
});

gulp.task('build', ['config', 'clean', 'save-version'], function (callback) {

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
