/*
 * Load all test fixtures
 */
const { lstatSync, readdirSync, readFileSync } = require('fs')
const { join } = require('path')

const log = require('fancy-log');

const FIXTURES_DIR = 'test/fixtures';
const PLANTUML_FILE = 'in.plantuml';
const OUTPUT_FILE = 'out';
const OUTPUT_FILE_MATCHER = new RegExp('.*\/' + OUTPUT_FILE + '\.(.+)');

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
        && source.match(OUTPUT_FILE_MATCHER)
    ).map(
      (source) => {
        const match = source.match(OUTPUT_FILE_MATCHER);
        return {
          name: match[0],
          format: match[1],
        }
      }
    )
}

module.exports = getDirectories(FIXTURES_DIR).map(
  (directory) => {
    var src;
    try {
      src = readFileSync(
        join(
          directory,
          PLANTUML_FILE
        ),
        'utf-8'
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
