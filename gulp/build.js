const conf = require('../conf');

const { task, series, parallel, src, dest } = require('gulp');
const { join } = require('path');

const log = require('fancy-log');

const rename = require('gulp-rename');
const pegjs = require('gulp-pegjs');
const ts = require('gulp-typescript');
const tspegjs = require('ts-pegjs');
const sourcemaps = require('gulp-sourcemaps');
const tsProject = ts.createProject('tsconfig.json');

const buildOptions = {
  format: 'commonjs',
  plugins: [tspegjs],
  tspegjs: {
    customHeader: '// import types\nimport * as types from \'./types\';',
  },
  returnTypes: {
    'PlantUMLFile': 'types.UML[]',
  },
};

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
        ...buildOptions,
      }).on('error', (e) => {
        log.error(e);
        cb(e.message);
      }),
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
        ...buildOptions,
      }).on('error', (e) => {
        log.error(e);
        cb(e.message);
      }),
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
