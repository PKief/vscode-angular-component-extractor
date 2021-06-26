import { getExtensionLogger, IVSCodeExtLogger } from "@vscode-logging/logger";
import { ExtensionContext } from "vscode";
import { getConfig as internalGetConfig } from "../config";
import { VSCodeAbstraction } from "../types";
import { getExtensionId, getExtensionName } from "./getExtensionId";

let _logger: IVSCodeExtLogger;

export function getLogger(): IVSCodeExtLogger {
  if (_logger === undefined) {
    throw new Error("Logger not yet defined");
  }
  return _logger;
}

export function initLogger(
  context: ExtensionContext,
  onDidChangeConfiguration: VSCodeAbstraction.OnDidChangeConfiguration,
  createOutputChannel: VSCodeAbstraction.CreateOutputChannel,
  getConfig: typeof internalGetConfig
): IVSCodeExtLogger {
  const extensionId = getExtensionId(context);
  const extensionName = getExtensionName(context);
  if (extensionId === undefined || extensionName === undefined) {
    throw new Error(
      "Could not read extension id and name from package.json file"
    );
  }
  const logLevel = getConfig(extensionId, "log-level");
  const sourceLocationLogging = getConfig(
    extensionId,
    "source-location-logging"
  );
  listenToLogSettingsChanges(
    context,
    onDidChangeConfiguration,
    extensionId,
    getConfig
  );
  return (_logger = getExtensionLogger({
    extName: extensionId,
    level: logLevel,
    sourceLocationTracking: sourceLocationLogging,
    logPath: context.logUri.toString(),
    logOutputChannel: createOutputChannel(extensionName),
    logConsole: true,
  }));
}

function listenToLogSettingsChanges(
  context: ExtensionContext,
  onDidChangeConfiguration: VSCodeAbstraction.OnDidChangeConfiguration,
  extensionId: string,
  getConfig: typeof internalGetConfig
) {
  // To enable dynamic logging level we must listen to VSCode configuration changes
  // on our `loggingLevelConfigProp` configuration setting.
  context.subscriptions.push(
    onDidChangeConfiguration((e) => {
      const getFullName = (label: string) => `${extensionId}.${label}`;
      if (e.affectsConfiguration(getFullName("log-level"))) {
        getLogger().changeLevel(getConfig(extensionId, "log-level"));
      }
      if (e.affectsConfiguration(getFullName("source-location-logging"))) {
        getLogger().changeSourceLocationTracking(
          getConfig(extensionId, "source-location-logging")
        );
      }
    })
  );
}
