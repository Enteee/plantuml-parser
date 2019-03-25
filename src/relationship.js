module.exports = class Relationship {
  constructor (left, right, leftType, rightType, leftArrowBody, rightArrowBody, leftCardinality, rightCardinality, name) {
    this.left = left;
    this.right = right;
    this.leftType = leftType || '';
    this.rightType = rightType || '';
    this.leftArrowBody = leftArrowBody || '';
    this.rightArrowBody = rightArrowBody || '';
    this.leftCardinality = leftCardinality || '';
    this.rightCardinality = rightCardinality || '';
    this.name = name || '';
  }
};
