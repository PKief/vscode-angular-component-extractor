// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { exec, execSync } from "child_process";
import * as path from "path";
import * as vscode from "vscode";
import { preRunChecks } from "./preRunChecks";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export const activate = (context: vscode.ExtensionContext) => {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "angular-component-extractor" is now active!'
  );

  const generateCommand = async (): Promise<void> => {
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

    let componentDirectory: string;
    try {
      componentDirectory = getDirectoryName();
    } catch (error) {
      vscode.window.showErrorMessage(
        `Could not find directory to generate component ${componentName}`
      );
      return;
    }

    let useNpx = false;

    try {
      checkAngularCli(componentDirectory);
    } catch (error) {
      useNpx = true;
    }

    vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        cancellable: false,
        title: "Generating Angular Component...",
      },
      generateComponentProgress(componentDirectory, componentName, useNpx)
    );
  };
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand(
    "angular-component-extractor.extract-component",
    generateCommand
  );

  context.subscriptions.push(disposable);
};

/**
 * Prompt the user to enter the name of the component which will be created
 * @returns Promise of the component name
 */
const getComponentName = (): Thenable<string | undefined> =>
  vscode.window.showInputBox({
    placeHolder: "Component name",
    prompt: "Enter component name",
    validateInput: (input: string) => {
      // only lower or upper case letters and dashes allowed
      const pattern = new RegExp(/^[a-z\-]+$/i);

      return pattern.test(input)
        ? undefined
        : "Please enter a valid component name";
    },
  });

/**
 * Check availability of Angular CLI on the command line
 * @param directory Directory which will use the Angular CLI
 */
const checkAngularCli = (directory: string) => {
  try {
    execSync("ng --version", { cwd: directory });
  } catch (error) {
    throw Error("Could not find Angular CLI, Error: " + error);
  }
};

/**
 * Get the name of the directory of the current file
 * @returns Name of the directory
 */
const getDirectoryName = () => {
  const fileName = vscode.window.activeTextEditor?.document.fileName;
  if (!fileName) {
    throw Error("Filename not known!");
  }
  return path.dirname(fileName);
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
): Promise<void> => {
  progress.report({ increment: 0 });

  /** Angular CLI command */
  const command =
    (useNpx ? "npx " : "") + `ng generate component ${componentName}`;

  exec(
    command,
    { cwd: componentDirectory },
    async (err, stdout: string, stderr: string) => {
      await Promise.resolve();

      progress.report({ increment: 100 });
      vscode.window.showInformationMessage(
        `Component ${componentName} generated successfully`
      );
      console.log("stdout: " + stdout);
      console.log(stderr);

      if (err) {
        vscode.window.showErrorMessage(
          `Component ${componentName} could not be created`
        );
        console.error("error: " + err);
      }
    }
  );
};

// this method is called when your extension is deactivated
export const deactivate = () => {};
