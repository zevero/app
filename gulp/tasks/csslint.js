'use strict';
var gulp  = require('gulp');
var csslint = require('gulp-csslint');
var config= require('../config');
var opts = {
  ids: false,
  'universal-selector': false,
  'adjoining-classes': false,
  'box-model': false,
  'box-sizing': false,
  'overqualified-elements': false,
  'vendor-prefix': false,
  'compatible-vendor-prefixes': false,
  'qualified-headings': false,
  'unique-headings': false
};
    
gulp.task('csslint', function() {
    return gulp.src(config.csslint)
        .pipe(csslint(opts))
        .pipe(csslint.reporter());
    //    .pipe(csslint.failReporter());
});