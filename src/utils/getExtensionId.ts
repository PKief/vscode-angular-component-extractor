import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";

let firstTime = true;
let extensionId: string | undefined;

/**
 * Load the extension id of the package json file
 * @param context Context of VS Code extension
 */
export function getExtensionId(
  context: vscode.ExtensionContext
): string | undefined {
  if (!firstTime) {
    return extensionId;
  }
  const extensionPath = path.join(context.extensionPath, "package.json");
  const packageFile = JSON.parse(fs.readFileSync(extensionPath, "utf8"));

  if (!packageFile) {
    console.error("Failed to read the extension name from package.json");
    return undefined;
  }
  return (extensionId = packageFile.name);
}
