'use strict';

/*jshint node: true */

var env = process.env.NODE_ENV || 'dev';
var NwBuilder = require('nw-builder');
var gulp = require('gulp');
var bump = require('gulp-bump');
var rename = require('gulp-rename');
var gutil = require('gulp-util');
var fs = require('fs');
var del = require("del");

console.log('Environment is', env);

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

// Defined method of updating:
// Semantic
gulp.task('bump', function(){
  return gulp.src(['./package.json', './bower.json'])
  .pipe(bump({type:'patch'}))
  .pipe(gulp.dest('./'));
});

gulp.task('default', ['build']);
