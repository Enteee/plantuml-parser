'use strict';

module.exports = class Interface {
  constructor (name, title, members) {
    this.name = name;
    this.title = title;
    this.members = members || [];
  }
};
