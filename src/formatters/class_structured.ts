// src/formatters/class_structured.ts
import { File, UML, Class, Interface, Enum, Group, Relationship, Method, MemberVariable } from '../types';

/**
 * Formatador estruturado para diagramas de classes
 * Organiza elementos em categorias específicas:
 * classes, interfaces, enums, packages, relationships
 */
export default function classStructuredFormatter(parseResult: (File | UML[])): string {
  // Estrutura do resultado final
  const result = {
    classes: [],
    interfaces: [],
    enums: [],
    packages: [],
    relationships: []
  };

  // Mapas para rastrear elementos por nome e tipo
  const elementTypeMap = new Map<string, string>();

  // Função auxiliar para extrair membros de uma classe/interface/enum
  function extractMembers(members: any[]) {
    const methods = [];
    const attributes = [];

    members.forEach(member => {
      if (member instanceof Method) {
        methods.push({
          name: member.name,
          isStatic: member.isStatic,
          accessor: member.accessor,
          returnType: member.returnType,
          arguments: member._arguments
        });
      } else if (member instanceof MemberVariable) {
        attributes.push({
          name: member.name,
          isStatic: member.isStatic,
          accessor: member.accessor,
          type: member.type
        });
      }
    });

    return { methods, attributes };
  }

  // Função auxiliar para determinar o tipo de relacionamento
  function determineRelationshipType(rel: Relationship): string {
    // Herança: --|> ou <|--
    if ((rel.leftArrowHead === '' && rel.rightArrowHead === '|>') ||
        (rel.leftArrowHead === '<|' && rel.rightArrowHead === '')) {
      return 'inheritance';
    }
    
    // Implementação: ..|> ou <|..
    if ((rel.leftArrowBody === '.' && rel.rightArrowHead === '|>') ||
        (rel.leftArrowHead === '<|' && rel.rightArrowBody === '.')) {
      return 'implementation';
    }
    
    // Composição: *-- ou --*
    if (rel.leftArrowHead === '*' || rel.rightArrowHead === '*') {
      return 'composition';
    }
    
    // Agregação: o-- ou --o
    if (rel.leftArrowHead === 'o' || rel.rightArrowHead === 'o') {
      return 'aggregation';
    }
    
    // Associação direcionada: --> ou <--
    if ((rel.leftArrowHead === '' && rel.rightArrowHead === '>') ||
        (rel.leftArrowHead === '<' && rel.rightArrowHead === '')) {
      return 'association_directed';
    }
    
    // Dependência: ..> ou <..
    if (rel.leftArrowBody === '.' && rel.rightArrowBody === '.') {
      return 'dependency';
    }
    
    // Associação simples: --
    if (rel.leftArrowHead === '' && rel.rightArrowHead === '') {
      return 'association';
    }
    
    return 'unknown';
  }

  // Função recursiva para extrair elementos
  (function extractElements(node: any) {
    if (node instanceof File) {
      // Se for um arquivo, processa cada diagrama dentro dele
      node.diagrams
        .filter(uml => uml instanceof UML)
        .forEach(uml => uml.elements.forEach(element => extractElements(element)));
    } else if (node instanceof Class) {
      // Processa classes
      const { methods, attributes } = extractMembers(node.members);
      
      const classObj = {
        name: node.name,
        title: node.title,
        isAbstract: node.isAbstract,
        attributes: attributes,
        methods: methods,
        extends: node.extends_,
        implements: node.implements_,
        generics: node.generics,
        stereotypes: node.stereotypes
      };
      
      result.classes.push(classObj);
      elementTypeMap.set(node.name, 'Class');
    } else if (node instanceof Interface) {
      // Processa interfaces
      const { methods, attributes } = extractMembers(node.members);
      
      const interfaceObj = {
        name: node.name,
        title: node.title,
        attributes: attributes,
        methods: methods,
        extends: node.extends_,
        generics: node.generics,
        stereotypes: node.stereotypes
      };
      
      result.interfaces.push(interfaceObj);
      elementTypeMap.set(node.name, 'Interface');
    } else if (node instanceof Enum) {
      // Processa enums
      const { methods, attributes } = extractMembers(node.members);
      
      const enumObj = {
        name: node.name,
        title: node.title,
        attributes: attributes,
        methods: methods,
        stereotypes: node.stereotypes
      };
      
      result.enums.push(enumObj);
      elementTypeMap.set(node.name, 'Enum');
    } else if (node instanceof Group) {
      // Processa grupos (principalmente pacotes)
      if (node.type === 'package' || node.type === 'namespace') {
        const pkg = {
          name: node.name,
          title: node.title,
          type: node.type,
          elements: []
        };
        
        result.packages.push(pkg);
        elementTypeMap.set(node.name, 'Package');

        // Extrai elementos dentro do pacote
        node.elements.forEach(element => {
          extractElements(element);
          
          if (element instanceof Class) {
            pkg.elements.push({
              type: 'Class',
              name: element.name,
              title: element.title,
              isAbstract: element.isAbstract
            });
          } else if (element instanceof Interface) {
            pkg.elements.push({
              type: 'Interface',
              name: element.name,
              title: element.title
            });
          } else if (element instanceof Enum) {
            pkg.elements.push({
              type: 'Enum',
              name: element.name,
              title: element.title
            });
          }
        });
      }
    } else if (node instanceof Relationship) {
      // Processa relacionamentos
      const relType = determineRelationshipType(node);
      
      const rel = {
        source: node.left,
        target: node.right,
        sourceType: elementTypeMap.get(node.left) || 'Unknown',
        targetType: elementTypeMap.get(node.right) || 'Unknown',
        relationshipType: relType,
        label: node.label || '',
        sourceCardinality: node.leftCardinality || '',
        targetCardinality: node.rightCardinality || '',
        sourceArrowHead: node.leftArrowHead,
        targetArrowHead: node.rightArrowHead,
        sourceArrowBody: node.leftArrowBody,
        targetArrowBody: node.rightArrowBody,
        hidden: node.hidden
      };

      // Tenta determinar tipos para elementos que ainda não foram mapeados
      if (rel.sourceType === 'Unknown') {
        const cls = result.classes.find(c => c.name === node.left);
        if (cls) {
          rel.sourceType = 'Class';
          elementTypeMap.set(node.left, 'Class');
        } else {
          const iface = result.interfaces.find(i => i.name === node.left);
          if (iface) {
            rel.sourceType = 'Interface';
            elementTypeMap.set(node.left, 'Interface');
          } else {
            const enm = result.enums.find(e => e.name === node.left);
            if (enm) {
              rel.sourceType = 'Enum';
              elementTypeMap.set(node.left, 'Enum');
            }
          }
        }
      }

      if (rel.targetType === 'Unknown') {
        const cls = result.classes.find(c => c.name === node.right);
        if (cls) {
          rel.targetType = 'Class';
          elementTypeMap.set(node.right, 'Class');
        } else {
          const iface = result.interfaces.find(i => i.name === node.right);
          if (iface) {
            rel.targetType = 'Interface';
            elementTypeMap.set(node.right, 'Interface');
          } else {
            const enm = result.enums.find(e => e.name === node.right);
            if (enm) {
              rel.targetType = 'Enum';
              elementTypeMap.set(node.right, 'Enum');
            }
          }
        }
      }

      result.relationships.push(rel);
    } else if (node instanceof Object) {
      // Processa outros tipos de nós recursivamente
      Object.keys(node).forEach(k => extractElements(node[k]));
    }
  })(parseResult);

  // Retorna o resultado formatado como JSON
  return JSON.stringify(result, null, 2);
}

