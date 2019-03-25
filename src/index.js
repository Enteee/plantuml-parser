const conf = require('../conf');

const { join } = require('path')
const { EOL } = require('os');

const Tracer = require('pegjs-backtrace');

const { parse } = require(join(conf.src.dir, 'plantuml'));
const { parse: parseTrace } = require(join(conf.src.dir, 'plantuml-trace'));

module.exports.parse = parse;
module.exports.parseTrace = function (src, options) {
  const tracer = new Tracer(
    src,
    {
      ...options,
      showTrace: true,
    }
  );
  try {
    const parsed = parseTrace(
      src,
      {
        ...options,
        tracer: tracer,
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

module.exports.formatters = require('./formatters');
