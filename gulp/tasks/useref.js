'use strict';
var gulp  = require('gulp');
var debug  = require('gulp-debug');
var rename  = require('gulp-rename');
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
  
  return gulp.src('www/index_dev.html')
    .pipe(debug({title: 'useref_in:'}))
    .pipe(assets)
    .pipe(debug({title: 'useref_assets:'}))
    .pipe(gulpif('*.js', uglify()))
    .pipe(gulpif('*.css', minifyCss()))
    .pipe(assets.restore())
    .pipe(useref())
    //.pipe(gulpif('*.html',replace({patterns:[{match: /<html/, replacement: '<html manifest=manifest.appcache'}]})))
    //.pipe(gulpif('*.html',minifyHtml({empty: true})))
    .pipe(debug({title: 'useref_out:'}))
    .pipe(gulpif('*.html',rename('index.html')))
    .pipe(debug({title: 'useref_html:'}))
    .pipe(gulp.dest(config.dest));
});

