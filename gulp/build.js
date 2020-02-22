const conf = require('../conf');

const { task, series, parallel, src, dest } = require('gulp');
const { join } = require('path');


const rename = require('gulp-rename');
const pegjs = require('gulp-pegjs');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const tsProject = ts.createProject('tsconfig.json');

task('build-copy-js',
  () => src(join(conf.src.dir, '**', '*.js'))
    .pipe(
      dest(conf.dist.dir),
    ),
);

task('build-optimized',
  (cb) => src(join(conf.src.dir, '*.pegjs'))
    .pipe(
      pegjs({
        ...conf.build.options,
      }).on('error', cb),
    )
    .pipe(
      rename('plantuml.ts'),
    )
    .pipe(
      dest(conf.src.dir),
    ),
);

task('build-debug',
  (cb) => src(join(conf.src.dir, '*.pegjs'))
    .pipe(
      pegjs({
        trace: true,
        ...conf.build.options,
      }).on('error', cb),
    )
    .pipe(
      rename('plantuml-trace.ts'),
    )
    .pipe(
      dest(conf.src.dir),
    ),
);

task('build-typescript',
  () => tsProject.src()
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(
      sourcemaps.write(
        '.',
        {
          includeContent: false,
          sourceRoot: '../src',
        },
      ),
    )
    .pipe(
      dest(conf.dist.dir),
    ),
);

task(
  'build',
  series(
    'build-copy-js',
    parallel(
      'build-optimized',
      'build-debug',
    ),
    'build-typescript',
  ),
);
