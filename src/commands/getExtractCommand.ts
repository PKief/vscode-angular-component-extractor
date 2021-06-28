import * as vscode from "vscode";
import {
  generateNewComponent,
  getChanges,
  isAngularCliAvailable,
} from "../angular";
import { getConfig } from "../config";
import { Changes } from "../types";
import {
  getComponentName,
  getDirectoryName,
  getExtensionId,
  preRunChecks,
  replaceSelection,
  startProgress,
  updateFiles,
} from "../utils";
import { getLogger } from "../utils/logger";

interface ExtractCommandData {
  changes: Changes;
  editor: vscode.TextEditor;
  componentName: string;
  componentDirectory: string;
  selection: vscode.Selection;
  useNpx: boolean;
}

/**
 * Get the command function to extract a child component
 * @param context Context of the extension
 * @returns Function which will be called when the command is executed
 */
export const getExtractCommand = async (context: vscode.ExtensionContext) => {
  const logger = getLogger();
  const commandData = await getExtractCommandData(context);
  if (commandData === undefined) {
    return;
  }

  const {
    useNpx,
    editor,
    componentName,
    componentDirectory,
    selection,
    changes,
  } = commandData;

  try {
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        cancellable: false,
        title: "Angular Extractor",
      },
      startProgress([
        {
          execute: () =>
            generateNewComponent(useNpx, componentName, componentDirectory),
          message: "Generate new component",
        },
        {
          execute: () => replaceSelection(editor, selection, changes),
          message: "Replace selection",
        },
        {
          execute: () =>
            updateFiles(changes, {
              getUri: vscode.Uri.file,
              writeFile: vscode.workspace.fs.writeFile,
              readFile: vscode.workspace.fs.readFile,
            }),
          message: "Update files",
        },
      ])
    );
  } catch (error) {
    logger.error(`Could not finish extracting the component because: ${error}`);
    vscode.window.showErrorMessage(error);
  }
};

/**
 * Get the information which is needed to execute the command
 * @param context Extension context
 * @returns Information needed to execute the command
 */
const getExtractCommandData = async (
  context: vscode.ExtensionContext
): Promise<ExtractCommandData | undefined> => {
  const logger = getLogger();
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
  const componentName = await getComponentName(vscode.window.showInputBox);

  if (componentName === undefined) {
    const message =
      "No component name was provided, so the extraction is canceled";
    logger.error(message);
    vscode.window.showErrorMessage(message);
    return;
  }

  const componentDirectory = getDirectoryName(document);
  if (componentDirectory === undefined) {
    const message = `Could not find directory to generate component ${componentName}`;
    logger.error(message);
    vscode.window.showErrorMessage(message);
    return;
  }

  // Use npx as fallback if the Angular CLI is not installed
  const useNpx =
    isAngularCliAvailable(componentDirectory, context.workspaceState) === false;

  const extensionId = getExtensionId(context);
  if (extensionId === undefined) {
    logger.error("Could not find extension id");
    return;
  }
  const defaultPrefix = getConfig(extensionId, "default-prefix");

  const changes = getChanges({
    componentName,
    directory: componentDirectory,
    selectedText,
    config: {
      defaultPrefix,
    },
  });

  return {
    useNpx,
    editor,
    changes,
    componentDirectory,
    componentName,
    selection,
  };
};
