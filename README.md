# plantuml-parser
_Parse PlantUML Syntax in JavaScript_

The goal of this project is to provide a feature-complete, well tested, and
maintainable [Parsing Expression Grammer (PEG)](src/plantuml.pegjsrammer)
for the PlantUML syntax. The parser is designed to be used as a [JavaScript library](#library)
or from the [Command Line](#command-line-interface)

*Important*: The parser is not feature-complete, yet. But we focus on writing a
robust parser which can parse parts of diagramw without implementing the full
syntax. This means that the parser probably still parses just about enough to get
you started. If not, please [contibute](#contribute). [#PlantUMLParser](https://twitter.com/hashtag/PlantUMLParser)

## Install

```
$ npm install --save plantuml-parser
```

## Features

- Diagrams Types:
  - [x] Class
  - [] Component
  - [] Use Case
  - [] Sequence
  - [] Activity
  - [] State
  - [] Object
  - [] Deployment
  - [] Timing
- Formatters:
  - [x] JSON
  - [x] Graph
- Testing, CI/CD:
  - [x] Fixtures for all formatters
  - [] Code coverage
  - [] Code linting
  - [] Fixture checking for Pull Requests

## Examples / Fixtures

We keep a set of PlantUML scripts in [test/fixtures/](test/fixtures) (`in.plantuml`) and the corresponding formatted output (`out.<formatter>`).

## Library

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

## Contribute

Every contribution counts! Please,

* ... submit unparsable diagrams via new [Issue](https://github.com/Enteee/plantuml-parser/issues/new).
* ... extend the parser by [forking](https://github.com/Enteee/plantuml-parser/fork) and [creating a Pull Request](https://github.com/Enteee/plantuml-parser/compare)

When contributin code, always also update the fixtures:

```
$ npm run fixtures
$ git commit
```

## References / Other

* [PlantUML code generator](https://github.com/bafolts/plantuml-code-generator)

## License

[Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0)
