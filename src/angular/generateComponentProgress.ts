import { exec, ExecException } from "child_process";
import { VSCodeAbstraction } from "../types";

export interface VSCodeAngular {
  showErrorMessage: VSCodeAbstraction.ShowErrorMessage;
  showInformationMessage: VSCodeAbstraction.ShowInformationmessage;
}

/**
 * Callback that returns the actual progress of VS Code to generate a component
 * @param componentDirectory Directory of the current component
 * @param componentName Name of the component which will be generated
 * @param useNpx If Angular CLI is not installed on the machine
 * @returns Promise that resolves if the component has beed created successfully
 */
export const generateComponentProgress = (
  componentDirectory: string,
  componentName: string,
  useNpx: boolean,
  vscode: VSCodeAngular
) => async (progress: VSCodeAbstraction.Progress) => {
  return new Promise<void>((resolve, reject) => {
    progress.report({ increment: 0 });

    /** Angular CLI command */
    const command =
      (useNpx ? "npx -p @angular/cli " : "") +
      `ng generate component ${componentName}`;

    exec(
      command,
      { cwd: componentDirectory },
      (err: ExecException | null, stdout: string, stderr: string) => {
        console.log("stdout: " + stdout);
        console.log(stderr);
        progress.report({ increment: 100 });

        if (err) {
          vscode.showErrorMessage(
            `Component ${componentName} could not be created`
          );
          console.error("error: " + err);
          reject(err);
        } else {
          vscode.showInformationMessage(
            `Component ${componentName} generated successfully`
          );
        }

        return resolve();
      }
    );
  });
};
