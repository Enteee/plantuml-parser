const conf = require('../conf');

const readFiles = require('read-vinyl-file-stream');

const { task, src, series } = require('gulp');
const { join, dirname } = require('path');
const { writeFileSync } = require('fs');
const { EOL } = require('os');

const mocha = require('gulp-mocha');
const log = require('fancy-log');

const Tracer = require('pegjs-backtrace');

const formatters = require(conf.formatters.dir);

task('test-run', () =>
  src(join(conf.test.dir, 'test.js'), { read: false })
    .pipe(mocha({
      // Stop on first error
      bail: false
    }))
);

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
          const destination = join(
            dirname(file.path),
            conf.fixtures.outputFilePrefix + name
          );
          const tracer = new Tracer(
            content,
            {
              useColor: false
            }
          );

          log.info('Updating: ' + destination);

          const formatter = formatters[name];

          const out = formatter(
            parse(
              content,
              {
                tracer: tracer
              }
            )
          ) + EOL;
          /*
        //Don't write trees they are too big:
        writeFileSync(
          join(
            dirname(file.path),
            conf.fixtures.treeFilePrefix + name
          ),
          tracer.getParseTreeString(),
          {
            encoding: conf.encoding
          }
        );
        */
          writeFileSync(
            destination,
            out,
            {
              encoding: conf.encoding
            }
          );
        }
      );
      cb();
    }))
);

task('test-fixtures-update', series(
  'build',
  'test-fixtures-update-run'
));

task('test', series(
  'build',
  'test-run'
));
