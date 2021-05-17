import * as vscode from "vscode";
import { convert } from "./angular";
import { getConfig } from "./config";
import { generateComponentProgress } from "./angular/generateComponentProgress";
import {
  getComponentName,
  getDirectoryName,
  getExtensionId,
  isAngularCliAvailable,
  preRunChecks,
  updateFiles,
} from "./utils";

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
    const selectedText = document.getText(selection);
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

    const extensionId = getExtensionId(context);
    if (extensionId === undefined) {
      return;
    }
    const defaultPrefix = getConfig<string>(extensionId, "default-prefix");
    if (defaultPrefix === undefined) {
      return;
    }
    const changes = convert({
      componentName,
      directory: componentDirectory,
      selectedText,
      config: {
        defaultPrefix,
      },
    });

    try {
      await updateFiles(editor, selection, changes);
    } catch (error: unknown) {
      const { message } = error as Error;
      vscode.window.showErrorMessage(message);
    }
  };
};
