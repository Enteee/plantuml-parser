#!/usr/bin/env node
const conf = require('../../conf.js');

const { writeSync, writeFileSync } = require('fs');
const { parse, parseFile, formatters } = require('../index');
const { EOL } = require('os');

const colorize = require('json-colorizer');
const getStdin = require('get-stdin');

const DEFAULT = {};

const argv = require('yargs') // eslint-disable-line
  .option('formatter', {
    alias: 'f',
    describe: 'formatter to use',
    default: 'default',
    choices: Object.keys(formatters),
  })
  .option('input', {
    alias: 'i',
    describe: 'input file(s) to read, supports globbing',
    default: DEFAULT,
    defaultDescription: 'stdin',
    type: 'string',
  })
  .option('output', {
    alias: 'o',
    describe: 'output file to write',
    type: 'string',
    default: DEFAULT,
    defaultDescription: 'stdout',
  })
  .option('color', {
    alias: 'c',
    describe: 'colorful output',
    default: false,
    boolean: true,
  })
  .option('verbose', {
    alias: 'v',
    describe: '1x print verbose output, 2x print parser tracing',
    default: 0,
    count: true,
  })
  .help()
  .argv;

const formatter = formatters[argv.formatter];
const options = {
  verbose: argv.verbose,
  showTrace: argv.verbose > 1,
  useColor: argv.color,
};

function read (cb) {
  if (argv.input === DEFAULT) {
    return getStdin().then(
      (data) => cb(
        null,
        parse(
          data,
          options,
        ),
      ),
    );
  }
  return parseFile(
    argv.input,
    options,
    cb,
  );
}

function write (data) {
  if (argv.color) {
    try {
      data = colorize(data);
    } catch (e) {
      // continue without colors
    }
  }
  if (argv.output === DEFAULT) {
    return writeSync(process.stdout.fd, data);
  }
  return writeFileSync(
    argv.output,
    data,
    {
      encoding: conf.encoding,
    },
  );
}

read(
  (err, ast) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    try {
      write(
        formatter(ast) + EOL,
        argv.output,
      );
    } catch (e) {
      console.error(e.message);
      process.exit(1);
    }
  },
);
