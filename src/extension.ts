// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
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

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "angular-component-extractor.extract-component",
    (): void => {
      const editor = preRunChecks(
        vscode.window.activeTextEditor,
        vscode.extensions.getExtension,
        vscode.languages.getDiagnostics
      );
      if (editor === undefined) {
        return;
      }
      const { document, selection } = editor;
      const word = document.getText(selection);
      vscode.window.showInformationMessage(word);
    }
  );

  context.subscriptions.push(disposable);
};

// this method is called when your extension is deactivated
export const deactivate = () => {};
