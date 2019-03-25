const { task, watch, series } = require('gulp');

task('watch', (cb) => {
  watch([
    'src/**/*.js',
    'src/**/*.pegjs',
    'format/**/*.js',
    '!src/**/plantuml.js',
    '!src/**/plantuml-trace.js'
  ], {
    ignoreInitial: false
  }, series(
    'test'
  ));
});
