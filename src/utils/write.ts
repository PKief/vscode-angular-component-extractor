import * as vscode from "vscode";
import { Changes, FileChange } from "../types";

/**
 * Update files which are related to the component extraction
 * @param changes Contains information which files need to be changed
 * @returns Promise which resolves when all changes are done
 */
export const updateFiles = (changes: Changes): Promise<void[]> => {
  return Promise.all(changes.files.map((fileChange) => updateFile(fileChange)));
};

/**
 * Replace the selection in the parent component's template with the selector of the generated child component
 * @param editor VS Code editor instance
 * @param selection Selected code of the template
 * @param changes Contains information which files need to be changed
 * @returns Promise which resolves when the replacement of in the template was successfully executed
 */
export const replaceSelection = async (
  editor: vscode.TextEditor,
  selection: vscode.Selection,
  changes: Changes
) => {
  return await editor.edit((editBuilder) => {
    editBuilder.replace(selection, changes.originTemplateReplacement);
  });
};

/**
 * Update a file based on the FileChange information
 * @param fileChange Contains the information about the content to be changed
 */
const updateFile = async (fileChange: FileChange): Promise<void> => {
  try {
    await vscode.workspace.fs.writeFile(
      getUri(fileChange.path),
      Buffer.from(fileChange.content)
    );
  } catch (error) {
    console.error(error);
  }
};

const getUri = (path: string): vscode.Uri => {
  return vscode.Uri.file(path);
};
