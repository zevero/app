module.exports = {
  jshint: ['./dev/js/**/*.js', '!./dev/js/bower_components/**', '!./dev/js/vendor/**'],
  csslint: ['./dev/css/**/*.css'],
  vendor: ['./dev/js/bower_components/**/*.css',
           './dev/js/bower_components/**/*.js',
           './dev/js/vendor/**/*.css',
           './dev/js/vendor/**/*.js'],
  dest: 'www'
};
