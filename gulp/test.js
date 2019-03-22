const conf = require('../conf');

const readFiles = require('read-vinyl-file-stream');

const { task, src, dest, series } = require('gulp');
const { join, dirname } = require('path');
const { writeFileSync } = require('fs');

const log = require('fancy-log');
const mocha = require('gulp-mocha');

const { parse } = require('../lib/plantuml');
const formats = require('../format');

task('test-run', () =>
  src('test/test.js', {read: false})
    .pipe(mocha({
      bail: true,
    }))
)

task('test-fixtures-update-run', () =>
  src('test/fixtures/**/in.plantuml')
  .pipe(readFiles(function (content, file, stream, cb) {
    Object.keys(formats).forEach(
      (name) => {
        const formatter = formats[name];
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
