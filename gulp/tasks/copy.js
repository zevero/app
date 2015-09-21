/*'use strict';
var gulp  = require('gulp');
var config= require('../config');

gulp.task('copy', ['clean'], function(cb){
     return gulp.src(config.assets,{base: config.dev})
    .pipe(gulp.dest(config.dest));
});*/