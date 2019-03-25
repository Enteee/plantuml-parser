# plantuml-parser
_Parse PlantUML Syntax in JavaScript_

* [Parsing Expression Grammer](src/plantuml.pegjs)

## Examples / Fixtures

We keep a set of PlantUML scripts in [test/fixtures/](test/fixtures) (`in.plantuml`) and the corresponding formatted output (`out.<formatter>`).

Before submitting a pull request make sure that you run:
```
$ npm run fixtures
```
This will update all fixtures and create a commit containing all the changes.

## Test

```
$ npm run test
```
