import { Diagnostic, Extension, TextEditor, Uri } from "vscode";

export const preRunChecks = <
  T extends Pick<TextEditor, "document" | "selection">
>(
  editor: T | undefined,
  getExtension: (extensionId: string) => Extension<any> | undefined,
  getDiagnostics: (resource: Uri) => Diagnostic[]
): T | undefined => {
  if (editor === undefined) {
    console.error("no active editor");
    return undefined;
  }

  const angularTsc = getExtension("angular.ng-template");
  if (angularTsc === undefined) {
    console.error("Angular Language Service is required for this extension");
    return undefined;
  }

  const { document, selection } = editor;
  const errorsWithinSelection = getDiagnostics(document.uri).filter(
    (diagnostic) => diagnostic.range.intersection(selection) !== undefined
  );
  if (errorsWithinSelection.length > 0) {
    console.error(
      "Could not extract a component, because there are errors within the html",
      errorsWithinSelection
    );
    return undefined;
  }
  return editor;
};
