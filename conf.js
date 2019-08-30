/**
 * Configuration
 */

const { join } = require('path');
const serializeError = require('serialize-error');

module.exports = {
  encoding: 'utf-8',
  src: {
    dir: join(__dirname, 'src/')
  },
  test: {
    dir: join(__dirname, 'test/')
  },
  formatters: {
    dir: join(__dirname, 'src/formatters/')
  },
  fixtures: {
    dir: join(__dirname, 'test/fixtures'),
    inputFile: 'in.plantuml',
    errorFile: 'error',
    parseOutputFilePrefix: 'parse-out.',
    parseFileOutputFilePrefix: 'parseFile-out.',
    treeFilePrefix: 'tree.',
    outputFileMatcher: new RegExp('.*/(parse(?:File)?)-out.(.+)'),
    serializeParseError: function(err) {
      err = serializeError(err);
      delete err.stack;
      return JSON.stringify(
        err,
        null,
        2
      );
    },
  },
};
