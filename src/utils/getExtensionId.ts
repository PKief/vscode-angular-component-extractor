import * as fs from "fs";
import * as path from "path";
import { ExtensionContext } from "vscode";

let firstTime = true;
let extensionId: string | undefined;
let extensionName: string | undefined;

/**
 * Load the extension id of the package json file
 * @param context Context of VS Code extension
 */
export function getExtensionId(context: ExtensionContext): string | undefined {
  readPackageFile(context.extensionPath);
  return extensionId;
}

/**
 * Load the extension display name of the package json file
 * @param context Context of VS Code extension
 */
export function getExtensionName(
  context: ExtensionContext
): string | undefined {
  readPackageFile(context.extensionPath);
  return extensionName;
}

function readPackageFile(contextExtensionPath: string): void {
  if (!firstTime) {
    return;
  }
  firstTime = false;
  const extensionPath = path.join(contextExtensionPath, "package.json");
  const packageFile = JSON.parse(fs.readFileSync(extensionPath, "utf8"));

  if (!packageFile) {
    console.error("Failed to read the package.json");
    return;
  }
  extensionId = packageFile.name;
  extensionName = packageFile.displayName;
}
