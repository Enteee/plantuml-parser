const { task, series } = require('gulp');

require('require-dir')('./gulp');

task('default',
  series(
    'build',
    'test'
  )
);
