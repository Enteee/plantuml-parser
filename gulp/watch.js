const { task, watch, series } = require('gulp');

task('watch', (cb) => {
  watch([
    '**/*.ts',
    '**/*.js',
    '**/*.pegjs',
    '!src/**/plantuml.ts',
    '!src/**/plantuml-trace.ts',
    '!dist/**'
  ], {
    ignoreInitial: false
  }, series(
    'test'
  ));
});
