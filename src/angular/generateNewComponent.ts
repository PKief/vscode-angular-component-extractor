import { exec, ExecException } from "child_process";

/**
 * Generate a new Angular component
 * @param useNpx If Angular CLI is not installed on the machine
 * @param componentName Name of the component which will be generated
 * @param componentDirectory Directory of the current component
 * @returns Promise that resolves if the component has beed created successfully
 */
export const generateNewComponent = (
  useNpx: boolean,
  componentName: string,
  componentDirectory: string
) => {
  return new Promise<void>((resolve, reject) => {
    const command =
      (useNpx ? "npx -p @angular/cli " : "") +
      `ng generate component ${componentName}`;

    exec(
      command,
      { cwd: componentDirectory },
      (err: ExecException | null, stdout: string, stderr: string) => {
        console.log("stdout: " + stdout);
        console.log(stderr);

        if (err) {
          console.error("error: " + err);
          reject(err);
        }

        return resolve();
      }
    );
  });
};
