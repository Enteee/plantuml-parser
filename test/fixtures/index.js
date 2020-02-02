/*
 * Load test fixtures
 *
 * fixtures = [
 *   {
 *     directory:,
 *     src:,
 *     error:,
 *     out: {
 *       name:,
 *       parser:,
 *       format:,
 *       src: ,
 *     }
 *   },
 *   ...
 * ]
 */
const conf = require('../../conf');

const { lstatSync, readdirSync, readFileSync } = require('fs');
const { join } = require('path');

const log = require('fancy-log');

function getDirectories (source) {
  return readdirSync(source)
    .map(name => join(source, name))
    .filter(
      (source) => lstatSync(source).isDirectory()
    );
}

function getOutputFiles (source) {
  return readdirSync(source)
    .map(name => join(source, name))
    .filter(
      (source) => lstatSync(source).isFile() &&
        source.match(
          conf.fixtures.outputFileMatcher
        )
    ).map(
      (source) => {
        const match = source.match(
          conf.fixtures.outputFileMatcher
        );
        return {
          name: match[0],
          parser: match[1],
          format: match[2],
          src: readFileSync(
            match[0],
            {
              encoding: conf.encoding
            }
          )
        };
      }
    );
}

module.exports = getDirectories(conf.fixtures.dir).map(
  (directory) => {
    const srcFile = join(directory, conf.fixtures.inputFile);
    const errorFile = join(directory, conf.fixtures.errorFile);
    var src;
    try {
      src = readFileSync(
        srcFile,
        conf.encoding
      );
    } catch (e) {
      log.warn('Skipping: ' + directory);
      return;
    }
    var error;
    try {
      error = conf.fixtures.deserializeParseError(
        readFileSync(
          errorFile,
          conf.encoding
        )
      );
    } catch (e) {
      // do nothing
    }
    return {
      directory: directory,
      srcFile: srcFile,
      src: src,
      error: error,
      out: getOutputFiles(directory)
    };
  }
).filter((i) => i !== undefined);
