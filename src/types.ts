export class Comment {
  constructor (
    public comment: string,
  ) {
    this.comment = comment || '';
  }
}

export class Note {
  constructor (
    public text: string,
    public of: string = '',
  ) {
    this.text = text || '';
    this.of = of || '';
  }
}

export class Component {
  constructor (
    public name: string,
    public title: string,
  ) {
  }
}

export class UseCase {
  constructor (
    public name: string,
    public title: string,
  ) {
  }
}

export type Accessor = ('-' | '#' | '~' | '+')
export class Method {
  constructor (
    public name: string,
    public isStatic: boolean,
    public accessor: Accessor,
    public returnType: string,
    public _arguments: string,
  ) {
    this.isStatic = !!isStatic;
    this.accessor = accessor || '+';
    this.returnType = returnType || 'void';
    this._arguments = _arguments || '';
  }
}

export class MemberVariable {
  constructor (
    public name: string,
    public isStatic: boolean,
    public accessor: Accessor,
    public type: string = '',
  ) {
    this.isStatic = !!isStatic;
    this.accessor = accessor || '+';
    this.type = type || '';
  }
}

export type Member = (Method | MemberVariable)
export class Enum {
  constructor (
    public name: string,
    public title: string,
    public members: Member[] = [],
    public extends_: string[] = [],
    public implements_: string[] = [],
    public generics: string[] = [],
    public stereotypes: string[] = [],
  ) {
    this.members = members || [];
    this.extends_ = extends_ || [];
    this.implements_ = implements_ || [];
    this.generics = generics || [];
    this.stereotypes = stereotypes || [];
  }
}

export class Interface {
  constructor (
    public name: string,
    public title: string,
    public members: Member[] = [],
    public extends_: string[] = [],
    public implements_: string[] = [],
    public generics: string[] = [],
    public stereotypes: string[] = [],
  ) {
    this.members = members || [];
    this.extends_ = extends_ || [];
    this.implements_ = implements_ || [];
    this.generics = generics || [];
    this.stereotypes = stereotypes || [];
  }
}

export class Class {
  constructor (
    public name: string,
    public title: string,
    public isAbstract: boolean,
    public members: Member[] = [],
    public extends_: string[] = [],
    public implements_: string[] = [],
    public generics: string[] = [],
    public stereotypes: string[] = [],
  ) {
    this.isAbstract = !!isAbstract;
    this.members = members || [];
    this.extends_ = extends_ || [];
    this.implements_ = implements_ || [];
    this.generics = generics || [];
    this.stereotypes = stereotypes || [];
  }
}

export type GroupType = ('package' | 'node' | 'folder' | 'frame' | 'cloud' | 'database')
export class Group {
  constructor (
    public name: string,
    public title: string,
    public type: GroupType,
    public elements: UMLElement[],
  ) {
  }
}

export type RelationshipArrowHead = (
  | ''
  | '<|'
  | '|>'
  | '*'
  | 'o'
  | '<'
  | '>'
  | '#'
  | 'x'
  | '}'
  | '{'
  | '+'
  | '^'
  | '()'
  | '('
  | ')'
);
export type RelationshipArrowBody = (
  | '-'
  | '.'
);
export class Relationship {
  constructor (
    public left: string,
    public right: string,
    public leftType: string,
    public rightType: string,
    public leftArrowHead: RelationshipArrowHead,
    public rightArrowHead: RelationshipArrowHead,
    public leftArrowBody: RelationshipArrowBody,
    public rightArrowBody: RelationshipArrowBody,
    public leftCardinality: string,
    public rightCardinality: string,
    public label: string,
    public hidden: boolean,
  ) {
    this.leftType = leftType || '';
    this.rightType = rightType || '';
    this.leftArrowHead = leftArrowHead || '';
    this.rightArrowHead = rightArrowHead || '';
    this.leftArrowBody = leftArrowBody || '-';
    this.rightArrowBody = rightArrowBody || '-';
    this.leftCardinality = leftCardinality || '';
    this.rightCardinality = rightCardinality || '';
    this.label = label || '';
    this.hidden = !!hidden;
  }
}

export type Stdlib_C4_Context_Type = ('Person' | 'Person_Ext' | 'System' | 'System_Ext' | 'SystemDb' | 'SystemQueue' | 'SystemDb_Ext' | 'SystemQueue_Ext');
export class Stdlib_C4_Context {
  constructor (
    public type_: { source: string, name: Stdlib_C4_Context_Type },
    public alias: string,
    public label: string,
    public descr: string = '',
    public sprite: string = '',
    public tags: string = '',
    public link: string = '',
  ) {
    this.descr = descr || undefined;
    this.sprite = sprite || undefined;
    this.tags = tags || undefined;
    this.link = link || undefined;
  }
}

export type Stdlib_C4_Container_Component_Type = ('ContainerQueue_Ext' | 'ContainerQueue' | 'ContainerDb_Ext' | 'ContainerDb' | 'Container_Ext' | 'Container' | 'ComponentQueue_Ext' | 'ComponentQueue' | 'ComponentDb_Ext' | 'ComponentDb' | 'Component_Ext' | 'Component');
export class Stdlib_C4_Container_Component {
  constructor (
    public type_: { source: string, name: Stdlib_C4_Container_Component_Type },
    public alias: string,
    public label: string,
    public techn: string = '',
    public descr: string = '',
    public sprite: string = '',
    public tags: string = '',
    public link: string = '',
  ) {
    this.techn = techn || undefined;
    this.descr = descr || undefined;
    this.sprite = sprite || undefined;
    this.tags = tags || undefined;
    this.link = link || undefined;
  }
}

export type Stdlib_C4_Boundary_Type = ('Boundary' | 'Enterprise_Boundary' | 'System_Boundary' | 'Container_Boundary');
export class Stdlib_C4_Boundary {
  constructor (
    public type_: { source: string, name: Stdlib_C4_Boundary_Type },
    public alias: string,
    public label: string,
    public tags: string,
    public link: string,
    public elements: UMLElement[],
  ) {
    this.tags = tags || undefined;
    this.link = link || undefined;
  }
}

export type UMLElement = (
  | Note
  | Component
  | UseCase
  | Enum
  | Interface
  | Class
  | Group
  | Relationship
  | Stdlib_C4_Context
  | Stdlib_C4_Container_Component
  | Stdlib_C4_Boundary
);
export class UML {
  constructor (
    public elements: UMLElement[],
  ) { }
}

export class File {
  constructor (
    public name: string,
    public diagrams: UML[],
  ) {
    this.diagrams = diagrams || [];
  }
}
