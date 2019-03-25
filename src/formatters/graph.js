const conf = require('../../conf');
const { join } = require('path');

const Class = require(join(conf.src.dir, 'class'));
const Interface = require(join(conf.src.dir, 'interface'));
const Relationship = require(join(conf.src.dir, 'relationship'));

const nodes = []
const edges = []

function parseAst(node){
  if(node instanceof Class || node instanceof Interface){
    nodes.push({
      id: node.name,
      type: 'Entity',
      label: node.name,
      title: node.name,
      shape: 'box',
      hidden: true
    });
    node.members.forEach(
      (attribute) => nodes.push({
        id: attribute.name,
        type: 'Attribute',
        label: attribute.name,
        title: attribute.name,
        shape: 'circle',
        hidden: true
      })
    );
  } else if(node instanceof Relationship){
    edges.push({
      from: node.left,
      to: node.right,
      label: 'has',
      hidden: true
    });
  } else if(node instanceof Object){
    Object.keys(node).map(
      (k) => parseAst(node[k])
    );
  }
}

module.exports = function(ast){
  parseAst(ast);
  return JSON.stringify(
    {
      nodes: nodes,
      edges: edges,
    },
    null,
    2
  );
}
