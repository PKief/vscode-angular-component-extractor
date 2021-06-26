import { LogLevel } from "@vscode-logging/logger";
import * as vscode from "vscode";

interface KnownConfigs {
  "default-prefix": string;
  "log-level": LogLevel;
  "source-location-logging": boolean;
}

export function getConfig<
  Key extends keyof KnownConfigs,
  Type extends KnownConfigs[Key]
>(extensionId: string, config: Key): Type;
export function getConfig<T>(
  extensionId: string,
  config: string
): T | undefined;

/**
 * Get the value of a configuration
 * @param extensionId Id of the extension (equivalent to the name in the package.json)
 * @param config Name of the config
 * @returns Value of the config
 */
export function getConfig<T>(
  extensionId: string,
  config: string
): T | undefined {
  return vscode.workspace.getConfiguration(extensionId).get<T>(config);
}
