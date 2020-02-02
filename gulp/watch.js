const { task, watch, series } = require('gulp');

task('watch', (cb) => {
  watch([
    'src/**/*.ts',
    'src/**/*.js',
    'src/**/*.pegjs',
    'test/**/*.js',
    '!src/**/plantuml.ts',
    '!src/**/plantuml-trace.ts'
  ], {
    ignoreInitial: false
  }, series(
    'test'
  ));
});
