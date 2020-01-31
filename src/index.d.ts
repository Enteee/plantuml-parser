import * as resultTypes from "./types";

declare namespace PlantUMLParser {
  export class Class {
    constructor(name: string, title: string, isAbstract: boolean, members: object[]);
  }

  export class Component {
    constructor(name: string, title: string);
  }

  export class Enum {
    constructor(name: string, title: string, members: object[]);
  }

  export class File {
    constructor(name: string, diagrams: object[]);
  }

  export class Group {
    constructor(name: string, title: string, type: string, elements: object[]);
  }

  export class Interface {
    constructor(name: string, title: string, members: object[]);
  }

  export class MemberVariable {
    constructor(name: string, isStatic: boolean, accessor: string, type: string);
  }

  export class Method {
    constructor(name: string, isStatic: boolean, accessor: string, returnType: string, _arguments?: string);
  }

  export class Relationship {
    constructor(left: string, right: string, leftType: string, rightType: string, leftArrowHead: string, rightArrowHead: string, leftArrowBody: string, rightArrowBody: string, leftCardinality: string, rightCardinality: string, label: string);
  }

  export class UML {
    constructor(elements: [PlantUMLParser.Class, PlantUMLParser.Class, PlantUMLParser.Relationship]);
  }

  export class UseCase {
    constructor(name: string, title: string);
  }

  export type parseOptions = {
    hiddenPaths?: string[];
    matchesNode?: boolean;
    maxPathLength?: number;
    maxSourceLines?: number;
    useColor?: boolean;
    verbose?: boolean;
  }
}

declare module 'plantuml-parser' {
  export function parse(data: string, options?: PlantUMLParser.parseOptions): PlantUMLParser.UML;
  export function parseFile(pattern: string[], options?: PlantUMLParser.parseOptions, cb?: (err: Error, result: object) => Promise<PlantUMLParser.UML>): PlantUMLParser.UML | Promise<PlantUMLParser.UML>;
  export const formatters: {
    default: (result: PlantUMLParser.UML) => string;
    graph: (result: PlantUMLParser.UML) => string;
  };
}
