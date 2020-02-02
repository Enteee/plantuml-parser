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
    public elements: Array<UMLElement>
  ) { }
};

