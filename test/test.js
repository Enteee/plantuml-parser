const conf = require('../conf');

const { lstatSync, readdirSync, readFileSync } = require('fs')
const { join } = require('path')
const { EOL } = require('os');
const { expect } = require('chai');

const log = require('fancy-log');
const Tracer = require('pegjs-backtrace');

const { parse } = require(join(conf.src.dir, 'plantuml'));
const { parse: parseTrace } = require(join(conf.src.dir, 'plantuml-trace'));
const formatters = require(conf.formatters.dir);


/**
 * Tests if parsing works
 * Yields readable output on error
 */
function testParse(src) {
  const tracer = new Tracer(
    src,
    {
      showTrace: true,
    }
  );
  try {
    const parsed = parseTrace(
      src,
      {
        tracer: tracer
      }
    );
  } catch (e) {
    try {
      e.message = 'Line ' + e.location.start.line + ': ' + e.message;
      e.message += EOL;
      e.message += EOL;
      e.message += tracer.getBacktraceString();
      e.message += EOL;
    } catch (e) { };
    throw e;
  }
};

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
      () => testParse(fixture.src)
    )
    fixture.out.forEach(
      (output) => it('format: ' + output.format,
        () => testFormatHasNotChanged(fixture.src, output)
      )
    )
  })
);
