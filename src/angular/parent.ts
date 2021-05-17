import * as vscode from "vscode";
import { getConfig } from "../config";

/**
 * Adjust the template of the parent component
 * @param componentName Name of the component
 * @param extensionId Extension ID to get the config
 */
export const adjustParentComponentTemplate = (
  componentName: string,
  extensionId: string
) => {
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
