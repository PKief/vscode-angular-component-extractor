import { execSync } from "child_process";

/**
 * Check availability of Angular CLI on the command line
 * @param directory Directory which will use the Angular CLI
 */
export const isAngularCliAvailable = (directory: string): boolean => {
  try {
    execSync("ng --version", { cwd: directory });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
