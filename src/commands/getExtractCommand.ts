import * as vscode from "vscode";
import { convert, generateComponentProgress } from "../angular";
import { getConfig } from "../config";
import {
  getComponentName,
  getDirectoryName,
  getExtensionId,
  isAngularCliAvailable,
  preRunChecks,
  updateFiles,
} from "../utils";

/**
 * Get the command function to extract a child component
 * @param context Context of the extension
 * @returns Function which will be called when the command is executed
 */
export const getExtractCommand = (context: vscode.ExtensionContext) => {
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
      generateComponentProgress(componentDirectory, componentName, useNpx, {
        showErrorMessage: vscode.window.showErrorMessage,
        showInformationMessage: vscode.window.showInformationMessage,
      })
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
