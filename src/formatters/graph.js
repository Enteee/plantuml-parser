const conf = require('../../conf');
const { join } = require('path');

const File = require(join(conf.src.dir, 'file'));
const UML = require(join(conf.src.dir, 'uml'));
const Class = require(join(conf.src.dir, 'class'));
const Interface = require(join(conf.src.dir, 'interface'));
const Relationship = require(join(conf.src.dir, 'relationship'));
const MemberVariable = require(join(conf.src.dir, 'memberVariable'));
const Component = require(join(conf.src.dir, 'component'));

module.exports = function (ast) {
  const nodes = [];
  const edges = [];

  var fileName = '';
  function linkToFile (node) {
    if (fileName) {
      edges.push({
        from: fileName,
        to: node.name,
        name: 'contains',
        hidden: true
      });
    }
  }

  (function extractNodes (node) {
    if (node instanceof File) {
      fileName = node.name;

      nodes.push({
        ...node,
        id: node.name,
        type: node.constructor.name,
        hidden: true
      });
      node.diagrams
        .filter(
          (uml) => uml instanceof UML
        )
        .forEach(
          (uml) => uml.elements.forEach(
            (element) => extractNodes(element)
          )
        );
    } else if (node instanceof Class || node instanceof Interface) {
      nodes.push({
        ...node,
        id: node.name,
        type: node.constructor.name,
        hidden: true
      });

      linkToFile(node);

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
              hidden: true
            });
            edges.push({
              from: node.name,
              to: attribute.name,
              name: 'has',
              hidden: true
            });

            linkToFile(attribute);
          }
        );
    } else if (node instanceof Component) {
      nodes.push({
        ...node,
        id: node.name,
        type: node.constructor.name,
        title: node.title,
        hidden: true
      });
      edges.push({
        from: node.name,
        to: fileName,
        name: 'contains',
        hidden: true
      });

      linkToFile(node);
    } else if (node instanceof Object) {
      Object.keys(node).map(
        (k) => extractNodes(node[k])
      );
    }
  })(ast);

  (function extractEdges (node) {
    function getNodeByName (nodeName) {
      return nodes.filter(
        (n) => n.name === nodeName
      )[0];
    }
    if (node instanceof Relationship) {
      const leftNode = getNodeByName(node.left);
      const rightNode = getNodeByName(node.right);

      if (leftNode === undefined || rightNode === undefined) {
        return;
      }

      if (
        (
          leftNode.type === 'Class' && rightNode.type === 'Class'
        ) || (
          leftNode.type === 'Class' && rightNode.type === 'Interface'
        ) || (
          leftNode.type === 'Interface' && rightNode.type === 'Class'
        ) || (
          leftNode.type === 'Interface' && rightNode.type === 'Interface'
        )
      ) {
        if (
          node.leftArrowHead === '' && node.leftArrowBody === '-' &&
          node.rightArrowBody === '-' && node.rightArrowHead === '|>'
        ) {
          edges.push({
            from: node.left,
            to: node.right,
            name: 'extends',
            hidden: true
          });
        } else if (
          node.leftArrowHead === '<|' && node.leftArrowBody === '-' &&
          node.rightArrowBody === '-' && node.rightArrowHead === ''
        ) {
          edges.push({
            from: node.right,
            to: node.left,
            name: 'extends',
            hidden: true
          });
        }
      } else if (
        leftNode.type === 'Component' && rightNode.type === 'Interface'
      ) {
        if (
          node.leftArrowHead === '' && node.leftArrowBody === '-' &&
          node.rightArrowBody === '-' && node.rightArrowHead === ''
        ) {
          // Component -- Interface
          edges.push({
            from: node.left,
            to: node.right,
            name: 'exposes',
            type: node.label.split(',')[0],
            availability: node.label.split(',')[1],
            hidden: true
          });
        } else if (
          node.leftArrowHead === '' && node.leftArrowBody === '.' &&
          node.rightArrowBody === '.' && node.rightArrowHead === '>'
        ) {
          // Component ..> Interface
          edges.push({
            from: node.left,
            to: node.right,
            name: 'consumes',
            direction: 'In',
            method: node.label.split(',')[0],
            frequency: node.label.split(',')[1],
            serviceAccount: node.label.split(',')[2],
            criticality: node.label.split(',')[3],
            hidden: true
          });
        } else if (
          node.leftArrowHead === '<' && node.leftArrowBody === '.' &&
          node.rightArrowBody === '.' && node.rightArrowHead === ''
        ) {
          // Component <.. Interface
          edges.push({
            from: node.left,
            to: node.right,
            name: 'consumes',
            direction: 'Out',
            method: node.label.split(',')[0],
            frequency: node.label.split(',')[1],
            serviceAccount: node.label.split(',')[2],
            criticality: node.label.split(',')[3],
            hidden: true
          });
        }
      } else if (
        leftNode.type === 'Interface' && rightNode.type === 'Component'
      ) {
        if (
          node.leftArrowHead === '' && node.leftArrowBody === '-' &&
          node.rightArrowBody === '-' && node.rightArrowHead === ''
        ) {
          // Interface -- Component
          edges.push({
            from: node.right,
            to: node.left,
            name: 'exposes',
            type: node.label.split(',')[0],
            availability: node.label.split(',')[1],
            hidden: true
          });
        } else if (
          node.leftArrowHead === '' && node.leftArrowBody === '.' &&
          node.rightArrowBody === '.' && node.rightArrowHead === '>'
        ) {
          // Interface ..> Component
          edges.push({
            from: node.right,
            to: node.left,
            name: 'consumes',
            direction: 'Out',
            method: node.label.split(',')[0],
            frequency: node.label.split(',')[1],
            serviceAccount: node.label.split(',')[2],
            criticality: node.label.split(',')[3],
            hidden: true
          });
        } else if (
          node.leftArrowHead === '<' && node.leftArrowBody === '.' &&
          node.rightArrowBody === '.' && node.rightArrowHead === ''
        ) {
          // Interface <.. Component
          edges.push({
            from: node.left,
            to: node.right,
            name: 'consumes',
            direction: 'In',
            method: node.label.split(',')[0],
            frequency: node.label.split(',')[1],
            serviceAccount: node.label.split(',')[2],
            criticality: node.label.split(',')[3],
            hidden: true
          });
        }
      }
    } else if (node instanceof Object) {
      Object.keys(node).map(
        (k) => extractEdges(node[k])
      );
    }
  })(ast);

  return JSON.stringify(
    {
      nodes: nodes,
      edges: edges
    },
    null,
    2
  );
};
