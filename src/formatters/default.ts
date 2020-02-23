import { File, UML } from '../types';

export default function defaultFormatter (parseResult: (File | UML[]) ): string {
  return JSON.stringify(
    parseResult,
    null,
    2,
  );
}
