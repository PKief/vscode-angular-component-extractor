import * as vscode from "vscode";
import { Changes, FileChange } from "../types";

export const updateFiles = (changes: Changes) => (): Promise<void> => {
  return new Promise<void>(async (resolve) => {
    await Promise.all(
      changes.files.map((fileChange) => updateFile(fileChange))
    );
    resolve();
  });
};

export const replaceSelection = (
  editor: vscode.TextEditor,
  selection: vscode.Selection,
  changes: Changes
) => () => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      await editor.edit((editBuilder) => {
        editBuilder.replace(selection, changes.originTemplateReplacement);
      });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

const updateFile = (fileChange: FileChange): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      vscode.workspace.fs.writeFile(
        getUri(fileChange.path),
        Buffer.from(fileChange.content)
      );
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

const getUri = (path: string): vscode.Uri => {
  return vscode.Uri.file(path);
};
