const conf = require('../conf');

const readFiles = require('read-vinyl-file-stream');

const { task, src, dest, series } = require('gulp');
const { join, dirname } = require('path');
const { writeFileSync, createWriteStream } = require('fs');

const log = require('fancy-log');
const mocha = require('gulp-mocha');

const Tracer = require('pegjs-backtrace');

const formatters = require(conf.formatters.dir);

/**
 * Hooks into stream write functions 
 * and redirect to file
 */
function hookStream(stream, callback) {
  var old_write = stream.write;

  stream.write = (function(write) {
    return function(string, encoding, fd) {
      write.apply(stream, arguments);  // comments this line if you don't want output in the console
      callback(string, encoding, fd);
    }
  })(stream.write);

  return function() {
    stream.write = old_write;
  }
}

task('test-run', () =>
  src(join(conf.test.dir, 'test.js'), {read: false})
    .pipe(mocha({
      bail: true
    }))
)

/**
 * Generate output for all formatters
 */
task('test-fixtures-update-run', () =>
  src(join(conf.fixtures.dir, '**/', conf.fixtures.inputFile))
  .pipe(readFiles(function (content, file, stream, cb) {
    Object.keys(formatters).forEach(
      (name) => {

        // import parser here, because it might not exist
        // when outer scope is loaded.
        const { parse } = require(join(conf.src.dir, 'plantuml-trace'));
        const tracer = new Tracer(
          content,
          {
            useColor:false,
          }
        );

        const formatter = formatters[name];

        const out = formatter(
            parse(
            content,
            {
              tracer: tracer
            }
          )
        );
        writeFileSync(
          join(
            dirname(file.path),
            conf.fixtures.treeFilePrefix + name
          ),
          tracer.getParseTree(),
          {
            encoding: conf.encoding
          }
        );
        writeFileSync(
          join(
            dirname(file.path),
            conf.fixtures.outputFilePrefix + name
          ),
          out,
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
