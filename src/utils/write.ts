import { Selection, TextEditor, Uri } from "vscode";
import { Changes, FileChange, VSCodeAbstraction } from "../types";
import { getLogger } from "./logger";

export interface VSCodeWrite {
  writeFile: VSCodeAbstraction.WriteFile;
  getUri: VSCodeAbstraction.GetUri;
  readFile: VSCodeAbstraction.ReadFile;
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
  const logger = getLogger().getChildLogger({ label: "write" });
  return await editor.edit((editBuilder) => {
    logger.info("Replace selection");
    logger.debug(
      `Replace selection (${selection}) with: `,
      changes.originTemplateReplacement
    );
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
  const logger = getLogger().getChildLogger({ label: "write" });
  try {
    const path = vscode.getUri(fileChange.path);
    const content = await getContent(fileChange, path, vscode);
    logger.info(`Update file ${path}`);
    logger.debug(`Update file ${path} with the content: `, content);
    await vscode.writeFile(path, Buffer.from(content));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error(
      `Error while writing to the file ${fileChange.path}: ${message}`,
      fileChange,
      error
    );
  }
}

async function getContent(
  fileChange: FileChange,
  path: Uri,
  vscode: VSCodeWrite
): Promise<string> {
  const logger = getLogger().getChildLogger({ label: "write" });
  logger.trace(
    `FileChange is of type '${fileChange.type}' for the file '${path}'`
  );
  if (fileChange.type === "update") {
    return vscode
      .readFile(path)
      .then((buffer) => buffer.toString())
      .then((currentContent) => {
        logger.trace("Current content of the file: ", currentContent);
        return currentContent;
      })
      .then((currentContent) => fileChange.newContent(currentContent));
  }
  return fileChange.content;
}
