import { Selection, TextEditor } from "vscode";
import { Changes, FileChange, VSCodeAbstraction } from "../types";

export interface VSCodeWrite {
  writeFile: VSCodeAbstraction.WriteFile;
  getUri: VSCodeAbstraction.GetUri;
}

/**
 * Update files which are related to the component extraction
 * @param changes Contains information which files need to be changed
 * @param vscode Contains vscode function abstractions
 * @returns Promise which resolves when all changes are done
 */
export const updateFiles = (
  changes: Changes,
  vscode: VSCodeWrite
): Promise<void> => {
  return Promise.all(
    changes.files.map((fileChange) => updateFile(fileChange, vscode))
  ).then(() => void 0);
};

/**
 * Replace the selection in the parent component's template with the selector of the generated child component
 * @param editor VS Code editor instance
 * @param selection Selected code of the template
 * @param changes Contains information which files need to be changed
 * @returns Promise which resolves when the replacement of in the template was successfully executed
 */
export const replaceSelection = async (
  editor: TextEditor,
  selection: Selection,
  changes: Changes
) => {
  return await editor.edit((editBuilder) => {
    editBuilder.replace(selection, changes.originTemplateReplacement);
  });
};

/**
 * Update a file based on the FileChange information
 * @param fileChange Contains the information about the content to be changed
 * @param vscode Contains vscode function abstractions
 */
async function updateFile(
  fileChange: FileChange,
  vscode: VSCodeWrite
): Promise<void> {
  try {
    vscode.writeFile(
      vscode.getUri(fileChange.path),
      Buffer.from(fileChange.content)
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(
      `Error while writing to the file ${fileChange.path}: ${message}`,
      fileChange,
      error
    );
  }
}
