/**
 * Configuratio
 */

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

module.exports ={
  encoding: 'utf-8',
  fixtures: {
    dir: 'test/fixtures',
    inputFile: 'in.plantuml',
    outputFilePrefix: 'out.',
    get outputFileMatcher () {
      return new RegExp(
      '.*\/' + escapeRegExp(this.outputFilePrefix) + '(.+)'
      )
    }
  },
}
