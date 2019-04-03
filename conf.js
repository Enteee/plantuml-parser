/**
 * Configuration
 */

const { join } = require('path');

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
    parseOutputFilePrefix: 'parse-out.',
    parseFileOutputFilePrefix: 'parseFile-out.',
    treeFilePrefix: 'tree.',
    outputFileMatcher: new RegExp('.*/(parse(?:File)?)-out.(.+)')
  }
};
