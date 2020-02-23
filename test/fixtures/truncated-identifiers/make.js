#!/usr/bin/env node
const IDENTIFIERS = [
  'skinparam',
  'together',
  'package',
  'namespace',
  'node',
  'folder',
  'frame',
  'cloud',
  'database',
  'rectangle',
  'note left',
  'note right',
  'note up',
  'note down',
  'note top',
  'note bottom',
  'class',
  'abstract class',
  'interface',
  'abstract interface',
  'enum',
  'component',
  'usecase',
];

const { writeFileSync, appendFileSync } = require('fs');

function out (str) {
  console.log(str);
  appendFileSync('in.plantuml', str + '\n');
}
function getAllTruncatedStrings (str) {
  const ret = [str];
  while (str.length > 0) {
    str = str.slice(0, -1);
    ret.push(str);
  }
  return ret;
}

writeFileSync('in.plantuml', '');
out('This file contains diagrams with all different kind of broken identifiers');
out('');
out('@startuml');
IDENTIFIERS.forEach(
  (i) => getAllTruncatedStrings(i).forEach(out),
);
out('@enduml');
