import { Diagnostic, Range, Uri } from "vscode";

export const sanityCheck = (
  getDiagnostics: (resource: Uri) => Diagnostic[],
  uri: Uri,
  range: Range
): Diagnostic[] => {
  return getDiagnostics(uri).filter(
    (diagnostic) => diagnostic.range.intersection(range) !== undefined
  );
};
