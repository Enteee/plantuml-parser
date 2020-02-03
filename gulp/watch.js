const { task, watch, series } = require('gulp');

task('watch', (cb) => {
  watch([
    '**/*.ts',
    '**/*.js',
    'src/**/*.pegjs',
    'test/**/*.js',
    '!src/**/plantuml.ts',
    '!src/**/plantuml-trace.ts',
    '!dist/**/*.js'
  ], {
    ignoreInitial: false
  }, series(
    'test'
  ));
});
