'use strict';

module.exports = class Method {
  constructor(name, isStatic, accessor, returnType, _arguments){
    this.name = name;
    this.isStatic = isStatic || false;
    this.accessor = accessor || '+';
    this.returnType = returnType || 'void';
    this._arguments = _arguments || '';
  }
}
