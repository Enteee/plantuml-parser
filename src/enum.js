'use strict';

module.exports = class Enum {
  constructor(name, members) {
    this.name = name;
    this.members = members || [];
  }
}
