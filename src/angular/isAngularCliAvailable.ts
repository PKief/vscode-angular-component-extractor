import { execSync } from "child_process";
import * as vscode from "vscode";

/**
 * Check availability of Angular CLI on the command line
 * @param directory Directory which will use the Angular CLI
 * @param state State object of the VS Code extension context
 */
export const isAngularCliAvailable = (
  directory: string,
  state: vscode.Memento
): boolean => {
  // check if Angular CLI availability check was already successful
  const storageKey = `ng-availability.${directory}`;
  const storageValue = state.get<boolean>(storageKey);
  if (storageValue !== undefined) {
    return storageValue;
  }
  try {
    execSync("ng --version", { cwd: directory });
    state.update(storageKey, true);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
