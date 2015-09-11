'use strict';
var gulp  = require('gulp');
var jshint  = require('gulp-jshint');
//var eslint  = require('gulp-eslint');
var config= require('../config');
var opts = {
        '-W097': true, //use strict only in function
        '-W030': true, //allow a.b && c()
        strict: true, trailing: true, eqeqeq: true, forin: true, unused: true, noempty: true,
        immed: true, latedef: true, nonbsp: true, nonew: true, undef: true,
        freeze: true, //prohibits tampering with the global Object
        maxcomplexity:10,
        quotmark: true,
        //curly: true,
          'globals': {
            //Server:
            'module': true,
            'require': true,
            '__dirname': true,
            'process': true,
            // Browser
            'jQuery': true,
            '$': true,
            'document': true,
            'console': true, 'sys': true,
            'alert': true, 'confirm': true,
            'window': true,
            'setTimeout': true, 'setInterval': true,
            'clearTimeout': true, 'clearInterval': true,
            'google': true,
            'Nedb': true,
            'app': true
        }
    };
/*    
 var eslint_opts = {
        //rulePaths: [
        //    'custom-rules/'
        //],
        rules: {
        //    'my-custom-rule': 1,
        //    'strict': 2
        },
        globals: {
            'jQuery':false,
            '$':true
        },
        envs: [
            'browser'
        ]
    };
  */       
         
gulp.task('jshint', function() {
    //return gulp.src(config.jshint)
    //.pipe(eslint(eslint_opts))
    //.pipe(eslint.formatEach('compact', process.stderr));
    //.pipe(eslint.format());
  
    return gulp.src(config.jshint)
    .pipe(jshint(opts))
    .pipe(jshint.reporter('default'));
});