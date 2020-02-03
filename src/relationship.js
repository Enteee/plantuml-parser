module.exports = class Relationship {
  constructor (left, right, leftType, rightType, leftArrowHead, rightArrowHead, leftArrowBody, rightArrowBody, leftCardinality, rightCardinality, label, hidden) {
    this.left = left;
    this.right = right;
    this.leftType = leftType || '';
    this.rightType = rightType || '';
    this.leftArrowHead = leftArrowHead || '';
    this.rightArrowHead = rightArrowHead || '';
    this.leftArrowBody = leftArrowBody || '';
    this.rightArrowBody = rightArrowBody || '';
    this.leftCardinality = leftCardinality || '';
    this.rightCardinality = rightCardinality || '';
    this.label = label || '';
    this.hidden = !!(hidden || false);
  }
};
