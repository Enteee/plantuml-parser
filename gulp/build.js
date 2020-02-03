const conf = require('../conf');

const { task, series, parallel, src, dest } = require('gulp');
const { join } = require('path');

const rename = require('gulp-rename');
const pegjs = require('gulp-pegjs');
const tspegjs = require('ts-pegjs');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');

task('build-optimized',
  (cb) => src(join(conf.src.dir, '*.pegjs'))
    .pipe(
      pegjs({
        ...conf.build.options
      }).on('error', cb)
    )
    .pipe(
      rename('plantuml.ts')
    )
    .pipe(
      dest(conf.src.dir)
    )
);

task('build-debug',
  (cb) => src(join(conf.src.dir, '*.pegjs'))
    .pipe(
      pegjs({
        trace: true,
        ...conf.build.options
      }).on('error', cb)
    )
    .pipe(
      rename('plantuml-trace.ts')
    )
    .pipe(
      dest(conf.src.dir)
    )
);

task('build-copy-js',
  (cb) => src(join(conf.src.dir, '**', '*.js'))
    .pipe(
      dest(conf.dist.dir)
    )
);

task('build-typescript',
  (cb) => tsProject.src()
    .pipe(tsProject())
    .pipe(
      dest(conf.dist.dir)
    )
);

task(
  'build',
  series(
    parallel(
      'build-optimized',
      'build-debug'
    ),
    parallel(
      'build-typescript',
      'build-copy-js',
    )
  )
);
