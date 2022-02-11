# plantuml-parser [![npm version](https://badge.fury.io/js/plantuml-parser.svg)](https://badge.fury.io/js/plantuml-parser) [![Build Status](https://travis-ci.com/Enteee/plantuml-parser.svg?branch=master)](https://travis-ci.com/Enteee/plantuml-parser) [![Coverage Status](https://coveralls.io/repos/github/Enteee/plantuml-parser/badge.svg?branch=master)](https://coveralls.io/github/Enteee/plantuml-parser?branch=master) [![Twitter URL](https://img.shields.io/twitter/url?label=%23PlantUMLParser&url=https%3A%2F%2Fgithub.com%2FEnteee%2Fplantuml-parser)](https://twitter.com/intent/tweet?text=Parse%20PlantUML%20with%20JavaScript%20or%20TypeScript%20%F0%9F%9A%80&hashtags=PlantUMLParser,JavaScript,TypeScript&url=https%3A%2F%2Fgithub.com%2FEnteee%2Fplantuml-parser)
_Parse PlantUML with JavaScript or TypeScript_

The aim of this project is to provide a feature-complete, well tested and
maintainable [Parsing Expression Grammar (PEG)](src/plantuml.pegjs)
for the [PlantUML](http://plantuml.com/) syntax. The parser is designed
to be used as [JavaScript library](#usage) or from the [Command Line](#command-line-interface).

**Important**: The parser is not yet feature-complete. But we focus on writing a
robust implementation which can parse parts of diagrams without knowing the full
syntax. This means that the parser probably still parses just about enough to get
you started. If not, please [contribute :heart:](#contribute-heart).

## Installation

```
$ npm install --save plantuml-parser
```

## Examples / Fixtures

PlantUML is not a formally defined language - something we would like to change.
This means we have to build this parser by reverse engineering from examples.
For this reason we keep a large set of PlantUML diagrams (`in.plantuml`) and the corresponding
formatted output (`parse[File]-out.<formatter>`) in [test/fixtures/](test/fixtures).
We even have diagrams which exposed bugs in the parser or diagrams which contain known
broken PlantUML syntax. Please help us expand that collection by [contributing](#contribute-heart)
your own diagrams. Every diagram counts :rocket:.

## Usage

```javascript
const { parse, parseFile, formatters } = require('plantuml-parser');

// Example PlantUML
const data = `
@startuml
  class A
  class B
  A --|> B
@enduml
`;

// parse PlantUML
const result = parse(data);

// Format and print parse result
console.log(
  formatters.default(result)
);
```

<details><summary>Output</summary>
<p>

```javascript
[
  {
    "elements": [
      {
        "name": "A",
        "title": "A",
        "isAbstract": false,
        "members": [],
        "extends_": [],
        "implements_": [],
        "generics": [],
        "stereotypes": []
      },
      {
        "name": "B",
        "title": "B",
        "isAbstract": false,
        "members": [],
        "extends_": [],
        "implements_": [],
        "generics": [],
        "stereotypes": []
      },
      {
        "left": "A",
        "right": "B",
        "leftType": "Unknown",
        "rightType": "Unknown",
        "leftArrowHead": "",
        "rightArrowHead": "|>",
        "leftArrowBody": "-",
        "rightArrowBody": "-",
        "leftCardinality": "",
        "rightCardinality": "",
        "label": "",
        "hidden": false
      }
    ]
  }
]
```

</p>
</details>

### `parse(data, options)`

Parse PlantUML in `data`. Returns the parse result.

* `data`: data to parse
* `options`: supports all [PEG.js parser options]. Enable tracing with
`options.verbose = true`. If tracing is enabled, `options` is also forwarded to the
tracer object. See [pegjs-backtrace options] for a full list of supported tracer options.

### `parseFile(pattern, options, cb)`

Parse all PlantUML diagrams in the files matching `pattern`. If given, the callback function `cb` will make this function behave asynchronous.

* `pattern`: files to parse, supports globbing, e.g.: `**/*.plantuml`.
* `options`: supports all [PEG.js parser options]. Enable tracing with
`options.verbose = true`. If tracing is enabled, `options` is also forwarded to the
tracer object. See [pegjs-backtrace options] for a full list of supported tracer options.
* `cb`: (optional) asynchronous callback. Called with: `cb(err, result)`

### `formatters`: A collection of built-in parse result formatters.

For a detailed description of all the formatters see [src/formatters](src/formatters).

## Command Line Interface

### Installation

```
# npm install --global plantuml-parser
```

### Usage

```
Options:
  --version        Show version number                                 [boolean]
  --formatter, -f  formatter to use
                              [choices: "default", "graph"] [default: "default"]
  --input, -i      input file(s) to read, supports globbing
                                                       [string] [default: stdin]
  --output, -o     output file to write               [string] [default: stdout]
  --color, -c      colorful output                    [boolean] [default: false]
  --verbose, -v    1x print verbose output, 2x print parser tracing
                                                            [count] [default: 0]
  --help           Show help                                           [boolean]
```

## Features

- Diagram Types:
  - [x] Class
  - [x] Component
  - [x] Use Case
  - [ ] Sequence
  - [ ] Activity
  - [ ] State
  - [ ] Object
  - [ ] Deployment
  - [ ] Timing
- Support for StdLibs:
  - [x] C4 (v2.4.0)
- Formatters:
  - [x] JSON
  - [x] Graph
- Testing, CI/CD:
  - [x] Fixtures for all formatters
  - [x] Code coverage
  - [x] Code formatting
  - [x] Code linting
  - [x] Error case testing
  - [ ] Dependency audit
- Misc
  - [x] Typescript support
  - [x] Fully typed parser result
  - [ ] [Internally typed parser](https://github.com/Enteee/plantuml-parser/issues/34)

## Test

```
$ npm test
```

This will run:
 * unit tests
 * code coverage
 * eslint

## Contribute :heart:

Every contribution counts. Please,

* ... submit unparsable diagrams via [new issue](https://github.com/Enteee/plantuml-parser/issues/new).
* ... extend the parser by [forking](https://github.com/Enteee/plantuml-parser/fork) and [creating a Pull Request](https://github.com/Enteee/plantuml-parser/compare)

When contributing code, always also update the fixtures and run tests.

```
$ npm run fixtures
$ npm test
$ git commit
```

For more information see our [contribution guidelines](/CONTRIBUTING.md).

## Related

* [PEG.js](https://pegjs.org): Parser Generator for JavaScript
* [ts-pegjs](https://github.com/metadevpro/ts-pegjs): Plugin for pegjs to generate TypeScript parsers
* [PlantUML code generator](https://github.com/bafolts/plantuml-code-generator): Provides a command line utility to generate code in various languages given a PlantUML class diagram.

## License

* [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0)

[PEG.js parser options]:https://pegjs.org/documentation#using-the-parser
[pegjs-backtrace options]:https://github.com/okaxaki/pegjs-backtrace#options
