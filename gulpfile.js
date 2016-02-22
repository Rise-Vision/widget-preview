'use strict';

/*jshint node: true */

var env = process.env.NODE_ENV || 'dev';
var NwBuilder = require('nw-builder');
var gulp = require('gulp');
var bump = require('gulp-bump');
var rename = require('gulp-rename');
var gutil = require('gulp-util');
var fs = require('fs');
var path = require('path');
var del = require("del");
var zip = require('gulp-zip');
var glob = require('glob');
var Q = require('q');
var runSequence = require("run-sequence");



gulp.task('config', function() {
  return gulp.src(['./web/config/' + env + '.js'])
    .pipe(rename('config.js'))
    .pipe(gulp.dest('./web/config'));
});

gulp.task('clean', function() {
  del(['./build/**']);
});

gulp.task('build', ['config', 'clean'], function (callback) {

    var nw = new NwBuilder({
      files: ['web/**', 'server.js', 'package.json',
        'node_modules/**'
        ],
      platforms: ['linux', 'osx', 'win'],
      version: '0.12.2' // override version so it stops trying to download the latest - https://goo.gl/MX7Lu2
    });

    // Log stuff you want
    nw.on('log', function (mgs) {
      gutil.log('node-webkit-builder', mgs);
    });

    // Build retruns a promise
    return nw.build(function (err) {
      if(err) {
          gutil.log('node-webkit-builder', err);
      }

      callback();
      gutil.beep();
    });
});

gulp.task('zip', function () {

  var promises = [];

  glob.sync('./build/rv-widget-dev-app/*').forEach(function(filePath) {
    if (fs.statSync(filePath).isDirectory()) {
      var defer = Q.defer();
      var dirName = path.basename(filePath);
      var pipeline = gulp.src(filePath + '/**')
        .pipe(zip('widget-preview-'+dirName+'.zip'))
        .pipe(gulp.dest('./build/dist'));
      pipeline.on('end', function() {
        defer.resolve();
      });
      defer.resolve();
      promises.push(defer.promise);
    }
  });

  return Q.all(promises);
});

gulp.task('dist', function(cb) {
  runSequence('build','zip', cb);
});

// Defined method of updating:
// Semantic
gulp.task('bump', function(){
  return gulp.src(['./package.json', './bower.json'])
  .pipe(bump({type:'patch'}))
  .pipe(gulp.dest('./'));
});

gulp.task('default', ['build']);
