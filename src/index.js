const conf = require('../conf');

const { join, relative } = require('path');
const { cwd } = require('process');
const { readFileSync } = require('fs');
const { map } = require('async');
const { EOL } = require('os');

const Tracer = require('pegjs-backtrace');
const fastGlob = require('fast-glob');

const { parse } = require(join(conf.src.dir, 'plantuml'));
const { parse: parseTrace } = require(join(conf.src.dir, 'plantuml-trace'));

const File = require(join(conf.src.dir, 'file'));

function parseSync (src, options) {
  options = options || {};

  if (options.verbose) {
    const tracer = new Tracer(src, options);
    try {
      const parsed = parseTrace(
        src,
        {
          ...options,
          tracer: tracer
        }
      );
      return parsed;
    } catch (e) {
      try {
        e.message = 'Line ' + e.location.start.line + ': ' + e.message;
        e.message += EOL;
        e.message += EOL;
        e.message += tracer.getBacktraceString();
        e.message += EOL;
      } catch (e) { }
      throw e;
    }
  }
  return parse(src, options);
};

module.exports.parse = parseSync;
module.exports.parseFile = function (globPattern, options, cb) {
  if (cb) {
    return map(
      fastGlob.sync(globPattern),
      (file, cb) => {
        try {
          cb(
            null,
            new File(
              relative(
                cwd(),
                file
              ),
              parseSync(
                readFileSync(file, conf.encoding),
                options
              )
            )
          );
        } catch (e) {
          cb(e);
        }
      },
      cb
    );
  }
  return fastGlob.sync(globPattern).map(
    (file) => new File(
      relative(
        cwd(),
        file
      ),
      parseSync(
        readFileSync(file, conf.encoding),
        options
      )
    )
  );
};

module.exports.formatters = require('./formatters');
