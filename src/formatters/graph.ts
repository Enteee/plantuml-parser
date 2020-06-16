import { File, UML, Component, MemberVariable, Interface, Class, Relationship } from '../types';

/**
 * TODO: make this propertly typed
 */

export default function graphFormatter (parseResult: (File | UML[])): string {
  const nodes: any[] = [];
  const edges: any[] = [];

  let fileName = '';
  function linkToFile (node: any) {
    if (fileName) {
      edges.push({
        from: fileName,
        to: node.name,
        name: 'contains',
        hidden: true,
      });
    }
  }

  (function extractNodes (node: any) {
    if (node instanceof File) {
      fileName = node.name;

      nodes.push({
        ...node,
        id: node.name,
        type: node.constructor.name,
        hidden: true,
      });
      node.diagrams
        .filter(
          (uml) => uml instanceof UML,
        )
        .forEach(
          (uml) => uml.elements.forEach(
            (element) => extractNodes(element),
          ),
        );
    } else if (node instanceof Class || node instanceof Interface) {
      nodes.push({
        ...node,
        id: node.name,
        type: node.constructor.name,
        hidden: true,
      });

      if (node.inherits) {
        // Add an edge to represent the relatioship
        const parentNode = nodes.find((item) => item.name === node.inherits);

        if (parentNode) {
          edges.push({
            from: node,
            to: parentNode,
            name: 'extends',
            hidden: true,
          });
        }
      }

      linkToFile(node);

      node.members
        .filter(
          (attribute) => attribute instanceof MemberVariable,
        )
        .forEach(
          (attribute) => {
            nodes.push({
              ...attribute,
              id: attribute.name,
              type: 'Attribute',
              hidden: true,
            });
            edges.push({
              from: node.name,
              to: attribute.name,
              name: 'has',
              hidden: true,
            });

            linkToFile(attribute);
          },
        );
    } else if (node instanceof Component) {
      nodes.push({
        ...node,
        id: node.name,
        type: node.constructor.name,
        title: node.title,
        hidden: true,
      });
      edges.push({
        from: node.name,
        to: fileName,
        name: 'contains',
        hidden: true,
      });

      linkToFile(node);
    } else if (node instanceof Object) {
      Object.keys(node).map(
        (k) => extractNodes(node[k]),
      );
    }
  })(parseResult);

  (function extractEdges (node: any) {
    function getNodeByName (nodeName: string) {
      return nodes.filter(
        (n) => n.name === nodeName,
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
            hidden: true,
          });
        } else if (
          node.leftArrowHead === '<|' && node.leftArrowBody === '-' &&
          node.rightArrowBody === '-' && node.rightArrowHead === ''
        ) {
          edges.push({
            from: node.right,
            to: node.left,
            name: 'extends',
            hidden: true,
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
            hidden: true,
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
            hidden: true,
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
            hidden: true,
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
            hidden: true,
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
            hidden: true,
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
            hidden: true,
          });
        }
      }
    } else if (node instanceof Object) {
      Object.keys(node).map(
        (k) => extractEdges(node[k]),
      );
    }
  })(parseResult);

  return JSON.stringify(
    {
      nodes: nodes,
      edges: edges,
    },
    null,
    2,
  );
}
