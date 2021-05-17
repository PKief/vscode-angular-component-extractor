import { Changes, FileChange } from "../types";
import * as vscode from "vscode";

export async function updateFiles(
  editor: vscode.TextEditor,
  selection: vscode.Selection,
  changes: Changes
): Promise<void> {
  await replaceSelection(editor, selection, changes);
  await Promise.all(changes.files.map((fileChange) => updateFile(fileChange)));
}

async function replaceSelection(
  editor: vscode.TextEditor,
  selection: vscode.Selection,
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

async function updateFile(fileChange: FileChange): Promise<void> {
  try {
    vscode.workspace.fs.writeFile(
      getUri(fileChange.path),
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

function getUri(path: string): vscode.Uri {
  return vscode.Uri.file(path);
}
