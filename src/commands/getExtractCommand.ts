import * as vscode from "vscode";
import { convert, startProgress } from "../angular";
import { getConfig } from "../config";
import {
  getComponentName,
  getDirectoryName,
  getExtensionId,
  isAngularCliAvailable,
  preRunChecks,
  updateFiles,
} from "../utils";
import { generateNewComponent } from "../angular/generateNewComponent";

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

    try {
      await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          cancellable: false,
          title: "Generating Angular Component...",
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
            execute: updateComponents(
              context,
              componentName,
              componentDirectory,
              selectedText,
              editor,
              selection
            ),
            message: "Update components",
          },
        ])
      );
    } catch (error) {
      console.error(error);
      vscode.window.showErrorMessage(error);
    }
  };
};

const updateComponents = (
  context: vscode.ExtensionContext,
  componentName: string,
  componentDirectory: string,
  selectedText: string,
  editor: vscode.TextEditor,
  selection: any
) => () => {
  return new Promise<void>(async (resolve, reject) => {
    const extensionId = getExtensionId(context);
    if (extensionId === undefined) {
      return reject("Could not find extension id");
    }
    const defaultPrefix = getConfig<string>(extensionId, "default-prefix");
    if (defaultPrefix === undefined) {
      return reject("Could not find default prefix");
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
      return resolve();
    } catch (error: unknown) {
      const { message } = error as Error;
      return reject(message);
    }
  });
};
