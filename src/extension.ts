import * as vscode from "vscode";
import { getExtractCommand } from "./commands";

export const activate = (context: vscode.ExtensionContext) => {
  console.log(
    'Congratulations, your extension "angular-component-extractor" is now active!'
  );

  const generateCommand = getExtractCommand(context);
  const disposable = vscode.commands.registerCommand(
    "angular-component-extractor.extract-component",
    () => generateCommand
  );

  context.subscriptions.push(disposable);
};

// this method is called when your extension is deactivated
export const deactivate = () => {};
