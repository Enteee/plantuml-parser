const conf = require('../conf');

const { task, parallel, src, dest } = require('gulp');
const { join } = require('path');

const log = require('fancy-log');
const rename = require('gulp-rename');
const pegjs = require('gulp-pegjs');

task('build-optimized',
  (cb) => src(join(conf.src.dir, '*.pegjs'))
  .pipe(
    pegjs({
      format: 'commonjs',
    }).on('error', cb)
  )
  .pipe(
    dest(conf.src.dir)
  )
);

task('build-debug',
  (cb) => src(join(conf.src.dir, '*.pegjs'))
  .pipe(
    pegjs({
      format: 'commonjs',
      trace: true
    }).on('error', cb)
  )
  .pipe(
    rename('plantuml-trace.js')
  )
  .pipe(
    dest(conf.src.dir)
  )
);

task('build', parallel(
  'build-optimized',
  'build-debug',
));
