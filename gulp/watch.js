const { task, watch, series } = require('gulp');

task('watch', (cb) => {
  watch([
    'src/**/*.ts',
    'src/**/*.js',
    'src/**/*.pegjs',
    '!src/**/plantuml.ts',
    '!src/**/plantuml-trace.ts',
    '!dist/'
  ], {
    ignoreInitial: false
  }, series(
    'test'
  ));
});
