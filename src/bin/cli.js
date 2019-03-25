#!/usr/bin/env node
const conf = require('../../conf.js');

const { createReadStream, readFile, writeSync, writeFileSync } = require('fs');
const { parse, parseTrace, formatters } = require(conf.src.dir);

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
    describe: 'input file to read',
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
    describe: 'print verbose output',
    default: false,
    boolean: true,
  })
  .help()
  .argv;

function read(cb){
  if (argv.input === DEFAULT)
      return getStdin().then(
        (data) => cb(null, data)
      );
  return readFile(
    argv.input,
    {
      encoding: conf.encoding
    },
    cb
  );
}

function write(data){
  if (argv.output === DEFAULT)
    return writeSync(process.stdout.fd, data);
  return writeFileSync(
    argv.output,
    data,
    {
      encoding: conf.encoding
    }
  );
}

const useParser = (argv.verbose) ? parseTrace : parse;
const formatter = formatters[argv.formatter];

read(
  (err, data) => {
    if (err)
      return console.error(err);
    try {
      write(
        formatter(
          useParser(
            data,
            {
              useColor: argv.color,
            }
          )
        ),
        argv.output,
      );
    } catch (e) {
      console.error(e.message);
      process.exit(1);
    }
  }
);
