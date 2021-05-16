import * as vscode from "vscode";

/** Get the value of a workspace config property */
export const getConfig = <T>(extensionId: string, config: string): T => {
  const value = vscode.workspace.getConfiguration(extensionId).get<T>(config);
  return value as T;
};
