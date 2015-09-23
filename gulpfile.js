'use strict';
Error.stackTraceLimit = Infinity;

var gulp  = require('gulp');
var config= require('./gulp/config');
var requireDir = require('require-dir');
requireDir('./gulp/tasks', { recurse: true });

gulp.task('default', function(){
  console.log('Usage:');
  if (!config.production){
    console.log('gulp watch   - while developing. Starts gulp dev repeatedly!');
  }
});


gulp.task('watch', ['dev'], function() {
  gulp.watch(config.csslint, ['csslint']);
  gulp.watch(config.jshint, ['jshint']);
  gulp.watch(config.vendor, ['useref']);
});
gulp.task('dev', ['jshint','csslint','useref']);
