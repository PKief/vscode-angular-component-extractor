import { execSync } from "child_process";
import * as vscode from "vscode";
import { getLogger } from "../../utils/logger";

/**
 * Check availability of Angular CLI on the command line
 * @param directory Directory which will use the Angular CLI
 * @param state State object of the VS Code extension context
 */
export const isAngularCliAvailable = (
  directory: string,
  state: vscode.Memento
): boolean => {
  const logger = getLogger().getChildLogger({ label: "isAngularCliAvailable" });
  // check if Angular CLI availability check was already successful
  const storageKey = `ng-availability.${directory}`;
  const storageValue = state.get<boolean>(storageKey);
  if (storageValue !== undefined) {
    logger.trace("get cached value");
    return storageValue;
  }
  try {
    const command = "ng --version";
    logger.debug(
      `Check if angular cli is available with the command '${command}' in the directory: ${directory}`
    );
    execSync(command, { cwd: directory });
    state.update(storageKey, true);
    logger.debug("angular cli is available");
    return true;
  } catch (error) {
    logger.warn(`Angular cli is not available because: ${error}`);
    return false;
  }
};
