'use strict';

module.exports = class MemberVariable {
  constructor(name, isStatic, accessor, type){
    this.name = name;
    this.isStatic = isStatic || false;
    this.accessor = accessor || '+';
    this.type = type || '';
  }
}
