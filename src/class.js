'use strict';

module.exports = class Class {
  constructor (name, isAbstract, members) {
    this.name = name;
    this.isAbstract = isAbstract || false;
    this.members = members || [];
  }
};
