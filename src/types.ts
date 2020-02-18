export class Note {
  constructor (
    public text: string = '',
    public of: string = ''
  ) {
    this.text = text || '';
    this.of = of || '';
  }
};

export type Accessor = ( '-' | '#' | '~' | '+' )
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
};

export type Member = ( Method )
export class Enum {
  constructor (
    public name: string,
    public title: string,
    public members: string[] = []
  ) {
    this.members = members || [];
  }
};

export type GroupType = ( 'package' | 'node' | 'folder' | 'frame' | 'cloud' | 'database' )
export class Group {
  constructor (
    public name: string,
    public title: string,
    public type: GroupType,
    public elements: UMLElement[]
  ) {
  }
};

export type UMLElement = (Note | Enum | Group);
export class UML {
  constructor (
    public elements: UMLElement[]
  ) { }
};

export class File {
  constructor (
    public name: string,
    public diagrams: UML[]
  ) {
    this.diagrams = diagrams || [];
  }
};
