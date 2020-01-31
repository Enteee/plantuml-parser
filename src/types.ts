export class Note {
  constructor (
    public text: string = '',
    public of: string = ''
  ) {
    this.text = text || '';
    this.of = of || '';
  }
};
