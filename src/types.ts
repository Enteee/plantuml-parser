export class Note {
  constructor (
    public text: string = '',
    public of: string = ''
  ) {
    this.text = text || '';
    this.of = of || '';
  }
};

export type UMLElement = (Note);

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
