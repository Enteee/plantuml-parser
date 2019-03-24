const conf = require('../conf');

const readFiles = require('read-vinyl-file-stream');

const { task, src, dest, series } = require('gulp');
const { join, dirname } = require('path');
const { writeFileSync } = require('fs');

const log = require('fancy-log');
const mocha = require('gulp-mocha');

const formatters = require(conf.formatters.dir);

task('test-run', () =>
  src(join(conf.test.dir, 'test.js'), {read: false})
    .pipe(mocha({
      bail: true,
      grep: "test/fixtures/class-sm",
    }))
)

task('test-fixtures-update-run', () =>
  src(join(conf.fixtures.dir, '**/in.plantuml'))
  .pipe(readFiles(function (content, file, stream, cb) {
    Object.keys(formatters).forEach(
      (name) => {

        const { parse } = require(join(conf.src.dir, 'plantuml'));

        const formatter = formatters[name];
        const outfile = join(
          dirname(file.path),
          conf.fixtures.outputFilePrefix + name
        );
        const ast = parse(content);
        writeFileSync(
          outfile,
          formatter(ast),
          {
            encoding: conf.encoding
          }
        );
      }
    );
    cb();
  }))
)

task('test-fixtures-update', series(
  'build',
  'test-fixtures-update-run'
));

task('test', series(
  'build',
  'test-run'
));
