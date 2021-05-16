import { exec, ExecException } from "child_process";
import * as vscode from "vscode";
import {
  adjustParentComponentTemplate,
  writeChildTemplate as writeChildComponentTemplate,
} from "./angular";
import { getComponentName } from "./utils/getComponentName";
import { getDirectoryName } from "./utils/getDirectoryName";
import { getExtensionId } from "./utils/getExtensionId";
import { isAngularCliAvailable } from "./utils/isAngularCliAvailable";
import { preRunChecks } from "./utils/preRunChecks";

export const activate = (context: vscode.ExtensionContext) => {
  console.log(
    'Congratulations, your extension "angular-component-extractor" is now active!'
  );

  const generateCommand = getExtractCommand(context);
  const disposable = vscode.commands.registerCommand(
    "angular-component-extractor.extract-component",
    generateCommand
  );

  context.subscriptions.push(disposable);
};

/**
 * Get the command function to extract a child component
 * @param context Context of the extension
 * @returns Function which will be called when the command is executed
 */
const getExtractCommand = (context: vscode.ExtensionContext) => {
  return async (): Promise<void> => {
    const editor = preRunChecks(
      vscode.window.activeTextEditor,
      vscode.extensions.getExtension,
      vscode.languages.getDiagnostics
    );
    if (editor === undefined) {
      return;
    }
    const { document, selection } = editor;
    const selectedSnippet = document.getText(selection);
    const componentName = await getComponentName();

    if (componentName === undefined) {
      return;
    }

    const componentDirectory = getDirectoryName(document);
    if (componentDirectory === undefined) {
      vscode.window.showErrorMessage(
        `Could not find directory to generate component ${componentName}`
      );
      return;
    }

    // Use npx as fallback if the Angular CLI is not installed
    const useNpx = isAngularCliAvailable(componentDirectory) === false;

    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        cancellable: false,
        title: "Generating Angular Component...",
      },
      generateComponentProgress(componentDirectory, componentName, useNpx)
    );

    try {
      writeChildComponentTemplate(
        componentDirectory,
        componentName,
        selectedSnippet
      );
    } catch (error) {
      vscode.window.showErrorMessage(
        `Could not write selected Code Snipped into generated component ${componentName}`
      );
      return;
    }

    try {
      const extensionId = getExtensionId(context);
      adjustParentComponentTemplate(componentName, extensionId);
    } catch (error) {
      vscode.window.showErrorMessage(
        `Could not replace selected code with <${componentName}></${componentName}>`
      );
      return;
    }
  };
};

/**
 * Callback that returns the actual progress of VS Code to generate a component
 * @param componentDirectory Directory of the current component
 * @param componentName Name of the component which will be generated
 * @param useNpx If Angular CLI is not installed on the machine
 * @returns Promise that resolves if the component has beed created successfully
 */
const generateComponentProgress = (
  componentDirectory: string,
  componentName: string,
  useNpx: boolean
) => async (
  progress: vscode.Progress<{
    message?: string | undefined;
    increment?: number | undefined;
  }>
) => {
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
          vscode.window.showErrorMessage(
            `Component ${componentName} could not be created`
          );
          console.error("error: " + err);
          reject(err);
        } else {
          vscode.window.showInformationMessage(
            `Component ${componentName} generated successfully`
          );
        }

        return resolve();
      }
    );
  });
};

// this method is called when your extension is deactivated
export const deactivate = () => {};
