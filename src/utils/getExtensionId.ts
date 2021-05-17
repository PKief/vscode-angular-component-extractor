import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";

/**
 * Load the extension id of the package json file
 * @param context Context of VS Code extension
 */
export const getExtensionId = (
  context: vscode.ExtensionContext
): string | undefined => {
  const extensionPath = path.join(context.extensionPath, "package.json");
  const packageFile = JSON.parse(fs.readFileSync(extensionPath, "utf8"));

  if (!packageFile) {
    console.error("Failed to read the extension name from package.json");
    return undefined;
  }
  return packageFile.name;
};
