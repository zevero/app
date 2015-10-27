'use strict';
Error.stackTraceLimit = Infinity;

var gulp  = require('gulp');
var config= require('./gulp/config');
var requireDir = require('require-dir');
requireDir('./gulp/tasks', { recurse: true });

gulp.task('default', function(){
  console.log('Usage:');
  if (!config.production){
    console.log('gulp watch - while developing. Starts gulp dev repeatedly!');
    console.log('gulp build - while developing. Builds production files!');
  }
});


gulp.task('watch', ['build'], function() {
  gulp.watch(config.csslint, ['csslint']);
  gulp.watch(config.jshint, ['jshint']);
  gulp.watch(config.vendor, ['useref']);
});
gulp.task('build', ['jshint','csslint','useref']);
