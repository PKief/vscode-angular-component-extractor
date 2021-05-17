import * as path from "path";
import * as vscode from "vscode";

/**
 * Get the name of the directory of the current file
 * @returns Name of the directory
 */
export const getDirectoryName = (
  document: vscode.TextDocument
): string | undefined => {
  const fileName = document.fileName;
  if (!fileName) {
    return undefined;
  }
  return path.dirname(fileName);
};
