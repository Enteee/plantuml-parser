const conf = require('../conf');

const readFiles = require('read-vinyl-file-stream');

const { task, src, series } = require('gulp');
const { join, dirname } = require('path');
const { writeFileSync, existsSync, unlinkSync } = require('fs');
const { EOL } = require('os');

const mocha = require('gulp-mocha');
const log = require('fancy-log');

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
      const { formatters } = require(conf.dist.dir);
      Object.keys(formatters).forEach(
        (name) => {
          // import parser here, because it might not exist
          // when outer scope is loaded.
          const { parse, parseFile } = require(join(conf.dist.dir));
          const formatter = formatters[name];

          const expectError = existsSync(
            join(
              dirname(file.path),
              conf.fixtures.errorFile
            )
          );

          log.info('Updating [' +
            name +
            ((expectError) ? ', error' : '') +
            ']: ' + dirname(file.path)
          );

          var astParse, errParse;
          try {
            astParse = parse(content);
          } catch (err) {
            if (!expectError) {
              throw err;
            }
            errParse = conf.fixtures.serializeParseError(err);
          }

          var astParseFile, errParseFile;
          try {
            astParseFile = parseFile(file.path);
          } catch (err) {
            if (!expectError) {
              throw err;
            }
            errParseFile = conf.fixtures.serializeParseError(err);
          }

          if (JSON.stringify(errParse) !== JSON.stringify(errParseFile)) {
            throw Error('inconsistent error ' + errParse + ' != ' + errParseFile);
          }

          const errorOutputFile = join(
            dirname(file.path),
            conf.fixtures.errorFile
          );
          const parseOutputFile = join(
            dirname(file.path),
            conf.fixtures.parseOutputFilePrefix + name
          );
          const parseFileOutputFile = join(
            dirname(file.path),
            conf.fixtures.parseFileOutputFilePrefix + name
          );

          if (expectError) {
            if (!errParse) {
              throw Error('Expected error, but got: ' + errParse);
            }

            writeFileSync(
              errorOutputFile,
              errParse,
              {
                encoding: conf.encoding
              }
            );

            // remove output files if they exist
            if (existsSync(parseOutputFile)) {
              unlinkSync(parseOutputFile);
            }

            if (existsSync(parseFileOutputFile)) {
              unlinkSync(parseFileOutputFile);
            }

            return;
          }

          writeFileSync(
            parseOutputFile,
            formatter(astParse) + EOL,
            {
              encoding: conf.encoding
            }
          );
          writeFileSync(
            parseFileOutputFile,
            formatter(astParseFile) + EOL,
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
