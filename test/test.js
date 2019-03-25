const conf = require('../conf');

const { lstatSync, readdirSync, readFileSync } = require('fs')
const { join } = require('path')
const { EOL } = require('os');
const { expect } = require('chai');

const log = require('fancy-log');

const { parse, parseTrace, formatters } = require(conf.src.dir);

/**
 * Test if the output produced by the
 * formatters has not changed.
 *
 * 1. Parse & Format
 * 2. Try decoding fixture and result
 *   from JSON for a deep and and more
 *   comparison, with meaningful log
 *   output. If this does not work
 *   fall back to string comparison.
 */
function testFormatHasNotChanged(src, out){
  const formatted = formatters[out.format](
      parse(src)
    )
  var expected;
  var result;
  try {
    // Try reading as JSON
    expected = JSON.parse(out.src);
    result = JSON.parse(formatted);
  } catch (e) {
    // fall back to string comparison
    expected = out.src
    result = formatted;
  }
  expect(
    expected
  ).to.deep.equal(
    result
  );
};

require('./fixtures').forEach((fixture) =>
  describe(fixture.directory, () => {
    it('parse',
      () => parse(fixture.src)
    )
    fixture.out.forEach(
      (output) => it('format: ' + output.format,
        () => testFormatHasNotChanged(fixture.src, output)
      )
    )
  })
);
