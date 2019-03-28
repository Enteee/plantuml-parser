# Formatters

This folder contains a collection of formatters for the parsed abstract syntax tree.

## Default

The default formatter converts the AST to prettified JSON.

## Graph

Formats the AST into a collection of Nodes and Edges:

```javascript
{
  "nodes": [
    ...
  ],
  "edges": [
    ...
  ]
}
```

According to the following Graph:

![Graph](http://www.plantuml.com/plantuml/proxy?src=https://raw.githubusercontent.com/Enteee/plantuml-parser/master/src/formatters/graph.plantuml)
