/*
 * Load test fixtures
 *
 * fixtures = [
 *   {
 *     directory:,
 *     src:,
 *     out: {
 *       name:,
 *       format:,
 *       src: ,
 *     }
 *   },
 *   ...
 * ]
 */
const conf = require('../conf');

const { lstatSync, readdirSync, readFileSync } = require('fs')
const { join } = require('path')

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
      (source) => lstatSync(source).isFile()
        && source.match(
          conf.fixtures.outputFileMatcher
        )
    ).map(
      (source) => {
        const match = source.match(
          conf.fixtures.outputFileMatcher
        );
        return {
          name: match[0],
          format: match[1],
          src: readFileSync(
            match[0],
            {
              encoding: conf.encoding,
            }
          ),
        }
      }
    )
}

module.exports = getDirectories(conf.fixtures.dir).map(
  (directory) => {
    var src;
    try {
      src = readFileSync(
        join(
          directory,
          conf.fixtures.inputFile
        ),
        conf.encoding
      );
    } catch(e) {
      log.warn('Skipping: ' + directory);
      return;
    }
    return {
      directory: directory,
      src: src,
      out: getOutputFiles(directory),
    };
  }
).filter((i) => i !== undefined);
