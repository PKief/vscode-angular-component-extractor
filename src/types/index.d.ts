import * as vscode from "vscode";

export interface Changes {
  originTemplateReplacement: string;
  files: FileChange[];
}

export interface FileChange {
  path: string;
  content: string;
}

export interface Config {
  defaultPrefix: string;
}

export namespace VSCodeAbstraction {
  export type Progress = vscode.Progress<{
    message?: string;
    increment?: number;
  }>;
  export type ShowErrorMessage = typeof vscode.window.showErrorMessage;
  export type ShowInformationmessage = typeof vscode.window.showInformationMessage;
  export type ShowInputBox = typeof vscode.window.showInputBox;
  export type WriteFile = typeof vscode.workspace.fs.writeFile;
  export type GetUri = typeof vscode.Uri.file;
}
