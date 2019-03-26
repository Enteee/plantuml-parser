const conf = require('../../conf');
const { join } = require('path');

const Class = require(join(conf.src.dir, 'class'));
const Interface = require(join(conf.src.dir, 'interface'));
const Relationship = require(join(conf.src.dir, 'relationship'));
const MemberVariable = require(join(conf.src.dir, 'memberVariable'));

module.exports = function (ast) {
  const nodes = [];
  const edges = [];

  function parseAst (node) {
    if (node instanceof Class || node instanceof Interface) {
      nodes.push({
        ...node,
        id: node.name,
        type: node.constructor.name,
        label: node.name,
        title: node.name,
        hidden: true
      });
      node.members
        .filter(
          (attribute) => attribute instanceof MemberVariable
        )
        .forEach(
        (attribute) => {
            nodes.push({
              ...attribute,
              id: attribute.name,
              type: 'Attribute',
              label: attribute.name,
              title: attribute.name,
              hidden: true
            });
            edges.push({
              from: node.name,
              to: attribute.name,
              label: 'has',
              hidden: true
            });
          }
        );
    } else if (node instanceof Relationship) {
      edges.push({
        from: node.left,
        to: node.right,
        label: 'has',
        hidden: true
      });
    } else if (node instanceof Object) {
      Object.keys(node).map(
        (k) => parseAst(node[k])
      );
    }
  }

  parseAst(ast);
  return JSON.stringify(
    {
      nodes: nodes,
      edges: edges
    },
    null,
    2
  );
};
