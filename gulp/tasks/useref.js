'use strict';
var gulp  = require('gulp');
var config= require('../config');

var useref = require('gulp-useref'); //usemin was not reliable
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var minifyHtml = require('gulp-minify-html');
var minifyCss = require('gulp-minify-css');
//var debug = require('gulp-debug');

var replace = require('gulp-replace-task');

gulp.task('useref', function() {
  var assets = useref.assets();
  
  return gulp.src('index.html')
    .pipe(assets)
    .pipe(gulpif('*.js', uglify()))
    .pipe(gulpif('*.css', minifyCss()))
    .pipe(assets.restore())
    .pipe(useref())
    //.pipe(gulpif('*.html',replace({patterns:[{match: /<html/, replacement: '<html manifest=manifest.appcache'}]})))
    //.pipe(gulpif('*.html',minifyHtml({empty: true})))
    .pipe(gulp.dest('www'));
});

