const { task, src, series } = require('gulp');
const mocha = require('gulp-mocha');

task('test-run', () =>
  src('test/test.js', {read: false})
    .pipe(mocha({
      bail: true,
    }))
)

task('test', series(
  'build',
  'test-run'
));
