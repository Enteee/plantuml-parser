const { lstatSync, readdirSync, readFileSync } = require('fs')
const { join } = require('path')

const log = require('fancy-log');
const Tracer = require('pegjs-backtrace');

const { parse } = require('../lib-debug/plantuml');

const fixtures = require('./fixtures');

function testParse(src) {
  const tracer = new Tracer(src);
  try {
    const parsed = parse(
      src,
      {
        tracer: tracer
      }
    );
  } catch (e) {
    e.message = 'Line ' + e.location.start.line + ': ' + e.message;
    log.error(
      tracer.getBacktraceString()
    );
    throw e;
  }
};

fixtures.forEach((fixture) =>
  describe(fixture.directory, () => {
    it('parse', () => testParse(fixture.src))
    fixture.out.forEach(
      (output) => it('format: ' + output.format, () => true)
    )
  })
);
