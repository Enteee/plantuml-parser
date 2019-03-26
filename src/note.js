'use strict';

module.exports = class Note {
  constructor (text, of) {
    this.text = text || '';
    this.of = of || '';
  }
};
