import * as path from "path";
import { Changes, Config, FileChange } from "../types";

export interface Input {
  directory: string;
  componentName: string;
  selectedText: string;
  config: Config;
}

export function convert(input: Input): Changes {
  return {
    originTemplateReplacement: getReplacement(input),
    files: [getComponentTemplateChange(input)],
  };
}

function getReplacement({ componentName, config }: Input) {
  return `<${config.defaultPrefix}-${componentName}></${config.defaultPrefix}-${componentName}>`;
}

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
