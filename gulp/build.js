const conf = require('../conf');

const { task, series, parallel, src, dest } = require('gulp');
const { join } = require('path');

const rename = require('gulp-rename');
const pegjs = require('gulp-pegjs');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');

task('build-typescript',
  (cb) => tsProject.src()
    .pipe(tsProject())
    .pipe(
      dest('dist')
    )
);

task('build-optimized',
  (cb) => src(join(conf.src.dir, '*.pegjs'))
    .pipe(
      pegjs({
        format: 'commonjs'
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

task(
  'build',
  series(
    'build-typescript',
    parallel(
      'build-optimized',
      'build-debug'
    )
  )
);
