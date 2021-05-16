import { exec, ExecException, execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { getConfig } from "./config";
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
      writeNewComponent(componentDirectory, componentName, selectedSnippet);
    } catch (error) {
      vscode.window.showErrorMessage(
        `Could not write selected Code Snipped into generated component ${componentName}`
      );
      return;
    }

    try {
      const extensionId = getExtensionId(context);
      adjustCurrentComponent(componentName, extensionId);
    } catch (error) {
      vscode.window.showErrorMessage(
        `Could not replace selected code with <${componentName}></${componentName}>`
      );
      return;
    }
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
const isAngularCliAvailable = (directory: string): boolean => {
  try {
    execSync("ng --version", { cwd: directory });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

/**
 * Get the name of the directory of the current file
 * @returns Name of the directory
 */
const getDirectoryName = (
  document: vscode.TextDocument
): string | undefined => {
  const fileName = document.fileName;
  if (!fileName) {
    return undefined;
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

const writeNewComponent = (
  directory: string,
  componentName: string,
  content: string
) => {
  const componentPath = path.join(
    directory,
    componentName,
    `${componentName}.component.html`
  );
  const componentUri = vscode.Uri.file(componentPath);
  vscode.workspace.fs.writeFile(componentUri, Buffer.from(content));
};

const adjustCurrentComponent = (componentName: string, extensionId: string) => {
  // Get the active text editor
  const editor = vscode.window.activeTextEditor;

  const document = editor?.document;
  const selection = editor?.selection;

  if (!editor || !document || !selection) {
    throw Error("Something went wrong");
  }

  // Get the default prefix from the VS Code settings
  const defaultPrefix = getConfig(extensionId, "default-prefix");

  // Component HTML tags
  const component = `<${defaultPrefix}-${componentName}></${defaultPrefix}-${componentName}>`;
  editor.edit((editBuilder) => {
    editBuilder.replace(selection, component);
  });
};

/**
 * Load the extension id of the package json file
 * @param context Context of VS Code extension
 */
const getExtensionId = (context: vscode.ExtensionContext): string => {
  const extensionPath = path.join(context.extensionPath, "package.json");
  const packageFile = JSON.parse(fs.readFileSync(extensionPath, "utf8"));

  if (!packageFile) {
    throw Error("Failed to initialize extension!");
  }
  return packageFile.name;
};

// this method is called when your extension is deactivated
export const deactivate = () => {};
