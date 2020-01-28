type parseOptions = {
  hiddenPaths?: string[];
  matchesNode?: boolean;
  maxPathLength?: number;
  maxSourceLines?: number;
  useColor?: boolean;
  verbose?: boolean;
}

declare class UML {
  constructor(elements: object[]);
}

declare module 'plantuml-parser' {
  export function parse(data: string, options?: parseOptions): UML;
  export function parseFile(pattern: string[], options?: parseOptions, cb?: (err: Error, ast: object) => Promise<UML>): UML | Promise<UML>;
  export const formatters: {
    default: (ast: UML) => string;
    graph: (ast: UML) => string;
  };
}
