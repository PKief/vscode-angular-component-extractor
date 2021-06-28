import * as vscode from "vscode";
import { getExtractCommand } from "./commands";
import { getConfig } from "./config";
import { initLogger } from "./utils/logger";

export const activate = (context: vscode.ExtensionContext) => {
  const logger = initLogger(
    context,
    vscode.workspace.onDidChangeConfiguration,
    vscode.window.createOutputChannel,
    getConfig
  );

  logger.info(
    'Congratulations, your extension "angular-component-extractor" is now active!'
  );

  const generateCommand = () => getExtractCommand(context);
  const disposable = vscode.commands.registerCommand(
    "angular-component-extractor.extract-component",
    generateCommand
  );

  context.subscriptions.push(disposable);
};

// this method is called when your extension is deactivated
export const deactivate = () => {};
