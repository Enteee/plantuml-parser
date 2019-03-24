'use strict';

module.exports = class MemberVariable {
  constructor(name, accessor){
    this.name = name;
    this.accessor = accessor || '+';
  }
}
