import { Selection, TextEditor } from "vscode";
import { Changes, FileChange, VSCodeAbstraction } from "../types";

export interface VSCodeWrite {
  writeFile: VSCodeAbstraction.WriteFile;
  getUri: VSCodeAbstraction.GetUri;
}

export async function updateFiles(
  editor: TextEditor,
  selection: Selection,
  changes: Changes,
  vscode: VSCodeWrite
): Promise<void> {
  await replaceSelection(editor, selection, changes);
  await Promise.all(
    changes.files.map((fileChange) => updateFile(fileChange, vscode))
  );
}

async function replaceSelection(
  editor: TextEditor,
  selection: Selection,
  changes: Changes
): Promise<void> {
  try {
    await editor.edit((editBuilder) => {
      editBuilder.replace(selection, changes.originTemplateReplacement);
    });
  } catch (error) {
    errorHandler(error, "Failed to replace selected snipped");
  }
}

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
    errorHandler(error, `Could not edit '${fileChange.path}`);
  }
}

function errorHandler(err: Error, text: string): never {
  console.error(
    `An error occured while writing a file. Message for the user '${text}'. Error: ${err.message}`,
    err
  );
  throw new Error(text);
}
