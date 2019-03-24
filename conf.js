/**
 * Configuration
 */

const { join } = require('path');

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

module.exports ={
  encoding: 'utf-8',
  src: {
    dir: join(__dirname, 'src/'),
  },
  test: {
    dir: join(__dirname, 'test/'),
  },
  formatters: {
    dir: join(__dirname, 'src/formatters/'),
  },
  fixtures: {
    dir: join(__dirname, 'test/fixtures'),
    inputFile: 'in.plantuml',
    outputFilePrefix: 'out.',
    treeFilePrefix: 'out.',
    get outputFileMatcher () {
      return new RegExp(
      '.*\/' + escapeRegExp(this.outputFilePrefix) + '(.+)'
      )
    }
  },
}
