import { exec, ExecException } from "child_process";
import { getLogger } from "../utils/logger";

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
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    const logger = getLogger().getChildLogger({
      label: "generateNewComponent",
    });

    const command =
      (useNpx ? "npx -p @angular/cli " : "") +
      `ng generate component ${componentName}`;

    logger.debug(`execute the following command: ${command}`);
    exec(
      command,
      { cwd: componentDirectory },
      (err: ExecException | null, stdout: string, stderr: string) => {
        logger.info("stdout: " + stdout);
        logger.info(stderr);

        if (err) {
          logger.fatal("error: " + err);
          reject(err);
        }

        return resolve();
      }
    );
  });
};
