import * as vscode from "vscode";

export interface Changes {
  originTemplateReplacement: string;
  files: FileChange[];
}

export type FileChange = FileChangeReplace | FileChangeUpdate;

/**
 * Should be used if the generated content needs to be updated
 */
export interface FileChangeUpdate {
  path: string;
  /**
   * Update the content of the file named in path
   * @param content the current content of the file
   */
  newContent: (content: string) => string;
  type: "update";
}

/**
 * Should be used if the generated content is replaced
 */
export interface FileChangeReplace {
  path: string;
  content: string;
  type: "replace";
}

export interface Config {
  defaultPrefix: string;
}

export namespace VSCodeAbstraction {
  export type ShowInputBox = typeof vscode.window.showInputBox;
  export type WriteFile = typeof vscode.workspace.fs.writeFile;
  export type ReadFile = typeof vscode.workspace.fs.readFile;
  export type GetUri = typeof vscode.Uri.file;
  export type OnDidChangeConfiguration = typeof vscode.workspace.onDidChangeConfiguration;
}
