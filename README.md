# plantuml-parser [![Build Status](https://travis-ci.org/Enteee/plantuml-parser.svg?branch=master)](https://travis-ci.org/Enteee/plantuml-parser)
_Parse PlantUML Syntax in JavaScript_

The aim of this project is to provide a feature-complete, well tested, and
maintainable [Parsing Expression Grammar (PEG)](src/plantuml.pegj)
for the [PlantUML](http://plantuml.com/) syntax. The parser is designed 
to be used as [JavaScript library](#usage) or from the [Command Line](#command-line-interface)

**Important**: The parser is not yet feature-complete. But we focus on writing a
robust implementation which can parse parts of diagram without knowing the full
syntax. This means that the parser probably still parses just about enough to get
you started. If not, please [contribute :octocat: :heart:](#contribute).

[#PlantUMLParser](https://twitter.com/hashtag/PlantUMLParser)

## Installation

```
$ npm install --global --save plantuml-parser
```

## Examples / Fixtures

We keep a set of PlantUML scripts (`in.plantuml`) and the corresponding formatted output (`out.<formatter>`) in [test/fixtures/](test/fixtures).

## Usage

```javascript
const { parse, parseTrace, formatters } = require('plantuml-parser');

// Example PlantUML
const data = `
@startuml
  class A
  class B
  A --|> B
@enduml
`;

// parse PlantUML
const ast = parse(data);

// Format and print AST
console.log(
  formatters.default(ast);
)
```

<details><summary>Output</summary>
<p>

```javascript
[
  [
    {
      "name": "A",
      "isAbstract": false,
      "members": []
    },
    {
      "name": "B",
      "isAbstract": false,
      "members": []
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
      "label": ""
    }
  ]
]
```

</p>
</details>

### `parse(data, options)`

Parse PlantUML in `data`. Returns abstract syntax tree.

* `data`: data to parse
* `options`: see [PEG.js parser options](https://pegjs.org/documentation#generating-a-parser-javascript-api)..

### `parseTrace(data, options)`

Parse PlantUML in `data`, produces tracing output for debugging. Returns abstract syntax tree.

* `data`: data to parse
* `options`: see [PEG.js parser options](https://pegjs.org/documentation#generating-a-parser-javascript-api)..

### `formatters`: A collection of built-in AST formatters.

For a detailed description of all the formatters see [src/formatters](src/formatters).

## Command Line Interface

```
Options:
  --formatter, -f  formatter to use
                              [choices: "default", "graph"] [default: "default"]
  --input, -i      input file to read                  [string] [default: stdin]
  --output, -o     output file to write               [string] [default: stdout]
  --color, -c      colorful output                    [boolean] [default: false]
  --verbose, -v    print verbose output               [boolean] [default: false]
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
- Formatters:
  - [x] JSON
  - [x] Graph
- Testing, CI/CD:
  - [x] Fixtures for all formatters
  - [x] Code coverage
  - [x] Code formatting
  - [x] Code linting
  - [ ] Dependency audit

## Test

```
$ npm test
```

This will run:
 * unit tests
 * code coverage
 * eslint

## Contribute :octocat: :heart:

Every contribution counts. Please,

* ... submit unparsable diagrams via [new issue](https://github.com/Enteee/plantuml-parser/issues/new).
* ... extend the parser by [forking](https://github.com/Enteee/plantuml-parser/fork) and [creating a Pull Request](https://github.com/Enteee/plantuml-parser/compare)

When contributing code, always also update the fixtures and run tests.

```
$ npm run fixtures
$ npm test
$ git commit
```

## Similar Projects

* [PlantUML code generator](https://github.com/bafolts/plantuml-code-generator): Provides a command line utility to generate code in various languages given a plantuml class diagram.

## License

* [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0)
