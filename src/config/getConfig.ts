import * as vscode from "vscode";

/**
 * Get the value of a configuration
 * @param extensionId Id of the extension (equivalent to the name in the package.json)
 * @param config Name of the config
 * @returns Value of the config
 */
export function getConfig<T>(
  extensionId: string,
  config: string
): T | undefined {
  return vscode.workspace.getConfiguration(extensionId).get<T>(config);
}
