'use strict';

module.exports = class Class {
  constructor (name, title, isAbstract, members) {
    this.name = name;
    this.title = title;
    this.isAbstract = isAbstract || false;
    this.members = members || [];
  }
};
