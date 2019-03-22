const { task, watch, series } = require('gulp');

require('./build.js');

task('watch', (cb) => {
  watch([
    'src/**/*.js',
    'src/**/*.pegjs',
    'format/**/*.js',
  ], {
    ignoreInitial: false
  }, series(
    'build'
  ));
});

task('watch-test', (cb) => {
  watch([
    'src/**/*.js',
    'src/**/*.pegjs',
    'format/**/*.js',
  ], {
    ignoreInitial: false
  }, series(
    'test'
  ));
});
