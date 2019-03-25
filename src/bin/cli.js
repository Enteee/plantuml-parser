#!/usr/bin/env node
const conf = require('../../conf.js');

const { createReadStream, readSync, readFileSync, writeSync, writeFileSync } = require('fs');

const getStdin = require('get-stdin');
const Tracer = require('pegjs-backtrace');
const formatters = require(conf.formatters.dir);

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

const {parse} = (argv.verbose) ? require('../plantuml-trace') : require('../plantuml');
const formatter = formatters[argv.formatter];

read(
  (err, data) => {
    if (err)
      return console.error(err);
    const tracer = new Tracer(
      data,
      {
        showTrace: argv.verbose,
        useColor: argv.color,
      }
    );
    write(
      formatter(
        parse(
          data,
          {
            tracer: tracer
          }
        )
      ),
      argv.output,
    );
  }
);
