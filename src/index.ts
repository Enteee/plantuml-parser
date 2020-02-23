import * as types from './types';
export * from './types';

import defaultFormatter from './formatters/default';
import graphFormatter from './formatters/graph';

/* eslint-disable @typescript-eslint/no-var-requires */
//TODO : use import here
const conf = require('../conf');

const { relative } = require('path');
const { cwd } = require('process');
const { readFileSync } = require('fs');
const { map } = require('async');
const { EOL } = require('os');

const Tracer = require('pegjs-backtrace');
const fastGlob = require('fast-glob');

const { parse } = require('./plantuml');
const { parse: parseTrace } = require('./plantuml-trace');
/* eslint-enable @typescript-eslint/no-var-requires */

export interface ParseOptions {
  hiddenPaths?: string[];
  matchesNode?: boolean;
  maxPathLength?: number;
  maxSourceLines?: number;
  useColor?: boolean;
  verbose?: boolean;
}

function parseSync (
  src: string,
  options: ParseOptions = {},
): types.UML[] {
  options = options || {};

  if (options.verbose) {
    const tracer = new Tracer(src, options);
    try {
      const parsed = parseTrace(
        src,
        {
          ...options,
          tracer: tracer,
        },
      );
      return parsed;
    } catch (e) {
      try {
        e.message = 'Line ' + e.location.start.line + ': ' + e.message;
        e.message += EOL;
        e.message += EOL;
        e.message += tracer.getBacktraceString();
        e.message += EOL;
      } catch (e) {
        // do nothing
      }
      throw e;
    }
  }
  return parse(src, options);
}

export { parseSync as parse };
export function parseFile (
  globPattern: (string | string[]),
  options: ParseOptions = {},
  cb: (error: Error, result: types.File) => void = null,
): types.File {
  options = options || {};
  // callback given
  if (cb) {
    return map(
      fastGlob.sync(globPattern),
      (
        file: string,
        cb: (error: Error, file: types.File) => void,
      ) => {
        let parseResult = null;
        try {
          parseResult = parseSync(
            readFileSync(file, conf.encoding),
            options,
          );
        } catch (e) {
          return cb(e, null);
        }

        return cb(
          null,
          new types.File(
            relative(
              cwd(),
              file,
            ),
            parseResult,
          ),
        );
      },
      cb,
    );
  }

  // no callback given
  return fastGlob.sync(globPattern).map(
    (file: string) => new types.File(
      relative(
        cwd(),
        file,
      ),
      parseSync(
        readFileSync(file, conf.encoding),
        options,
      ),
    ),
  );
}

type Formatter = (parseResult: (types.File | types.UML[])) => any;
type Formatters = {
  default: Formatter;
  graph: Formatter;
}

export const formatters: Formatters = {
  default: defaultFormatter,
  graph: graphFormatter,
};

