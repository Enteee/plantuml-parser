const conf = require('../conf');

const { describe, it } = require('mocha');
const { expect, assert } = require('chai');

const { parse, parseFile, formatters } = require(conf.src.dir);

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
function testFormatHasNotChanged (fixture, output) {
  var formatted;
  switch (output.parser) {
    case 'parse':
      formatted = formatters[output.format](
        parse(fixture.src)
      );
      break;
    case 'parseFile':
      formatted = formatters[output.format](
        parseFile(fixture.srcFile)
      );
      break;
    default:
      assert.fail('Unknown parser: ' + output.parser);
      break;
  }
  var expected;
  var result;
  try {
    // Try reading as JSON
    expected = JSON.parse(output.src);
    result = JSON.parse(formatted);
  } catch (e) {
    // fall back to string comparison
    expected = output.src;
    result = formatted;
  }
  expect(
    expected
  ).to.deep.equal(
    result
  );
}

// Happy path testing
function testFixture (fixture) {
  it('parse',
    () => parse(fixture.src)
  );

  it('parseFile - async',
    (cb) => parseFile(fixture.srcFile, null, cb)
  );

  it('parseFile',
    () => parseFile(fixture.srcFile)
  );

  fixture.out.forEach(
    (output) => it(output.parser + '-output.' + output.format,
      () => testFormatHasNotChanged(fixture, output)
    )
  );
}

// Test for errors
function testErrorFixture (fixture) {
  function expectFixtureError (error) {
    expect(error).to.be.an(
      'object',
      'Error not thrown: ' +
      conf.fixtures.serializeParseError(fixture.error)
    );
    expect(
      conf.fixtures.deserializeParseError(
        conf.fixtures.serializeParseError(error)
      )
    ).to.deep.equals(
      fixture.error
    );
  }

  it('parse',
    () => {
      var error;
      try {
        parse(fixture.src);
      } catch (e) {
        error = e;
      }
      expectFixtureError(error);
    }
  );

  it('parseFile - async',
    (cb) => parseFile(fixture.srcFile, null,
      (err, fixture) => {
        try {
          expectFixtureError(err);
        } catch (e) {
          return cb(e);
        }
        return cb();
      }
    )
  );

  it('parseFile',
    () => {
      var error;
      try {
        parseFile(fixture.srcFile);
      } catch (e) {
        error = e;
      }
      expectFixtureError(error);
    }
  );
}

require('./fixtures').forEach(
  (fixture) => {
    if (fixture.error) {
      describe(
        'Error - ' + fixture.directory,
        () => testErrorFixture(fixture)
      );
    } else {
      describe(
        fixture.directory,
        () => testFixture(fixture)
      );
    }
  }
);
