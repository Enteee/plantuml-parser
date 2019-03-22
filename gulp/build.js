const { task, parallel, src, dest } = require('gulp');
const log = require('fancy-log');
const pegjs = require('gulp-pegjs');

task('build-optimized',
  (cb) => src('src/*.pegjs')
  .pipe(
    pegjs({
      format: 'commonjs',
    }).on('error', cb)
  )
  .pipe(
    dest('lib')
  )
);

task('build-debug',
  (cb) => src('src/*.pegjs')
  .pipe(
    pegjs({
      format: 'commonjs',
      trace: true
    }).on('error', cb)
  )
  .pipe(
    dest('lib-debug')
  )
);

task('build', parallel(
  'build-optimized',
  'build-debug',
));
