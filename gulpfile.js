const { task, series } = require('gulp');

require('./gulp');

task('default',
  series(
    'build',
    'test'
  )
);
