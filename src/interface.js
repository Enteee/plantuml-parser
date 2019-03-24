'use strict';

module.exports = class Interface {
  constructor(name, members) {
    this.name = name;
    this.members = members || [];
  }
}
