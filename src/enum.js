'use strict';

module.exports = class Enum {
  constructor (name, title, members) {
    this.name = name;
    this.title = title;
    this.members = members || [];
  }
};
