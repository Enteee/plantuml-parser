'use strict';

module.exports = class File {
  constructor (name, diagrams) {
    this.name = name;
    this.diagrams = diagrams || [];
  }
};
