# plantuml-parser
_Parse PlantUML Syntax in JavaScript_

The goal of this project is to provide a feature-complete, well tested, and
maintainable [Parsing Expression Grammer (PEG)](src/plantuml.pegjsrammer)
for the [PlantUML](http://plantuml.com/) syntax. The parser is designed 
to be used as a [JavaScript library](#usage) or from the [Command Line](#command-line-interface)

**Important**: The parser is not yet feature-complete. But we focus on writing a
robust implementation which can parse parts of diagram without knowing the full
syntax. This means that the parser probably still parses just about enough to get
you started. If not, please [contibute](#contribute) :octocat:. [#PlantUMLParser](https://twitter.com/hashtag/PlantUMLParser)

## Installtion

```
$ npm install --save plantuml-parser
```

## Examples / Fixtures

We keep a set of PlantUML scripts in [test/fixtures/](test/fixtures) (`in.plantuml`) and the corresponding formatted output (`out.<formatter>`).

## Features

- Diagrams Types:
  - [x] Class
  - [ ] Component
  - [ ] Use Case
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
  - [ ] Code coverage
  - [ ] Code linting
  - [ ] Fixture checking for Pull Requests

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

* `parse(data, options)`: Parse PlantUML in (`data`). Returns abstract syntax tree.
* `parseTrace(data, options)`: Parse PlantUML in (`data`) and proces tracing output for debugging. Returns abstract syntax tree.
* `options`: see [PEG.js parser options](https://pegjs.org/documentation#generating-a-parser-javascript-api).
* `formatters`: A collection of built-in AST formatters.

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

# JavaScript API

## Test

```
$ npm run test
```

## Contribute :octocat:

Every contribution counts! Please,

* ... submit unparsable diagrams via [new issue](https://github.com/Enteee/plantuml-parser/issues/new).
* ... extend the parser by [forking](https://github.com/Enteee/plantuml-parser/fork) and [creating a Pull Request](https://github.com/Enteee/plantuml-parser/compare)

When contributin code, always also update the fixtures:

```
$ npm run fixtures
$ git commit
```

## References / Other

* [PlantUML code generator](https://github.com/bafolts/plantuml-code-generator): Provides a command line utility to generate code in various languages given a plantuml class diagram.

## License

[Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0)
