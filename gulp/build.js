const { task, src, dest } = require('gulp');
const log = require('fancy-log');
const pegjs = require('gulp-pegjs');

task('build', function(cb) {
  return src('src/*.pegjs')
    .pipe(
      pegjs().on('error', cb)
    )
    .pipe(
      dest('lib')
    );
});
