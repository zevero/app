module.exports = {
  jshint: ['./www/js/**/*.js', '!./www/js/bower_components/**', '!./www/js/vendor/**'],
  csslint: ['./www/css/**/*.css'],
  vendor: ['./www/index_dev.html',
           './www/js/bower_components/**/*.css',
           './www/js/bower_components/**/*.js',
           './www/js/vendor/**/*.css',
           './www/js/vendor/**/*.js'],
  dest: 'www'
};
