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
    public generics: string = '',
    public stereotype: string = '',
  ) {
    this.members = members || [];
    this.extends_ = extends_ || [];
    this.implements_ = implements_ || [];
    this.generics = generics || '';
    this.stereotype = stereotype || '';
  }
}

export class Interface {
  constructor (
    public name: string,
    public title: string,
    public members: Member[] = [],
    public extends_: string[] = [],
    public implements_: string[] = [],
    public generics: string = '',
    public stereotype: string = '',
  ) {
    this.members = members || [];
    this.extends_ = extends_ || [];
    this.implements_ = implements_ || [];
    this.generics = generics || '';
    this.stereotype = stereotype || '';
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
    public generics: string = '',
    public stereotype: string = '',
  ) {
    this.isAbstract = !!isAbstract;
    this.members = members || [];
    this.extends_ = extends_ || [];
    this.implements_ = implements_ || [];
    this.generics = generics || '';
    this.stereotype = stereotype || '';
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

export type UMLElement = (
  | Note
  | Component
  | UseCase
  | Enum
  | Interface
  | Class
  | Group
  | Relationship
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
