/**
 * Configuration
 */

const { join } = require('path');
const tspegjs = require('ts-pegjs');
const serializeError = require('serialize-error');

module.exports = {
  encoding: 'utf-8',
  src: {
    dir: join(__dirname, 'src/')
  },
  dist: {
    dir: join(__dirname, 'dist/')
  },
  test: {
    dir: join(__dirname, 'test/')
  },
  build: {
    options: {
      format: 'commonjs',
      plugins: [tspegjs],
      tspegjs: {
        customHeader: '// import types\nimport * as types from \'./types\';'
      },
      returnTypes: {
        'PlantUMLFile': 'types.UML[]'
      }
    }
  },
  fixtures: {
    dir: join(__dirname, 'test/fixtures'),
    inputFile: 'in.plantuml',
    errorFile: 'error',
    parseOutputFilePrefix: 'parse-out.',
    parseFileOutputFilePrefix: 'parseFile-out.',
    treeFilePrefix: 'tree.',
    outputFileMatcher: new RegExp('.*/(parse(?:File)?)-out.(.+)'),
    serializeParseError: function (err) {
      err = serializeError(err);
      delete err.stack;
      return JSON.stringify(
        err,
        null,
        2
      );
    },
    deserializeParseError: function (err) {
      return JSON.parse(err);
    }
  }
};
