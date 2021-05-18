import * as path from "path";
import { Changes, Config, FileChange } from "../types";

export interface Input {
  directory: string;
  componentName: string;
  selectedText: string;
  config: Config;
}

/**
 * Convert component information into Changes object
 * @param input Input for a component change
 * @returns Changes object
 */
export function convert(input: Input): Changes {
  return {
    originTemplateReplacement: getReplacement(input),
    files: [getComponentTemplateChange(input)],
  };
}

/**
 * Get the replacement code of the child component's template
 * @param param0 Input parameter
 * @returns New Template code of child component
 */
function getReplacement({ componentName, config }: Input): string {
  return `<${config.defaultPrefix}-${componentName}></${config.defaultPrefix}-${componentName}>`;
}

/**
 * Get the file change information of the component
 * @param param0 Input parameter
 * @returns FileChange information
 */
function getComponentTemplateChange({
  directory,
  componentName,
  selectedText,
}: Input): FileChange {
  return {
    content: selectedText,
    path: path.join(
      directory,
      componentName,
      `${componentName}.component.html`
    ),
  };
}
