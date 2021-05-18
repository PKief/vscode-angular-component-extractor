import * as vscode from "vscode";
import {
  generateNewComponent,
  getChanges,
  isAngularCliAvailable,
} from "../angular";
import { getConfig } from "../config";
import {
  getComponentName,
  getDirectoryName,
  getExtensionId,
  preRunChecks,
  replaceSelection,
  startProgress,
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
    const useNpx =
      isAngularCliAvailable(componentDirectory, context.workspaceState) ===
      false;

    const extensionId = getExtensionId(context);
    if (extensionId === undefined) {
      console.error("Could not find extension id");
      return;
    }
    const defaultPrefix = getConfig<string>(extensionId, "default-prefix");
    if (defaultPrefix === undefined) {
      console.error("Could not find default prefix");
      return;
    }

    const changes = getChanges({
      componentName,
      directory: componentDirectory,
      selectedText,
      config: {
        defaultPrefix,
      },
    });

    try {
      await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          cancellable: false,
          title: "Angular Extractor",
        },
        startProgress([
          {
            execute: generateNewComponent(
              useNpx,
              componentName,
              componentDirectory
            ),
            message: "Generate new component",
          },
          {
            execute: replaceSelection(editor, selection, changes),
            message: "Replace selection",
          },
          {
            execute: updateFiles(changes),
            message: "Update files",
          },
        ])
      );
    } catch (error) {
      console.error(error);
      vscode.window.showErrorMessage(error);
    }
  };
};
