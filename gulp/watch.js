const { task, watch, series } = require('gulp');

require('./build.js');

task('watch', (cb) => {
  watch([
    'src/**/*.js',
    'src/**/*.pegjs'
  ], series(
    'build'
  ));
});
