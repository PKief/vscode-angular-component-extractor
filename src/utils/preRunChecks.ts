import { Diagnostic, Extension, TextEditor, Uri } from "vscode";
import { getLogger } from "./logger";

export const preRunChecks = <
  T extends Pick<TextEditor, "document" | "selection">
>(
  editor: T | undefined,
  getExtension: (extensionId: string) => Extension<any> | undefined,
  getDiagnostics: (resource: Uri) => Diagnostic[]
): T | undefined => {
  const logger = getLogger();
  if (editor === undefined) {
    logger.error("No active editor");
    return undefined;
  }

  const angularTsc = getExtension("angular.ng-template");
  if (angularTsc === undefined) {
    logger.error("Angular Language Service is required for this extension");
    return undefined;
  }

  const { document, selection } = editor;
  const errorsWithinSelection = getDiagnostics(document.uri).filter(
    (diagnostic) => diagnostic.range.intersection(selection) !== undefined
  );
  if (errorsWithinSelection.length > 0) {
    logger.error(
      "Could not extract a component, because there are errors within the html",
      errorsWithinSelection
    );
    return undefined;
  }
  return editor;
};
