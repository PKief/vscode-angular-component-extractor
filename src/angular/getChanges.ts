import * as ngHtmlParser from "angular-html-parser";
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
export const getChanges = (input: Input): Changes => {
  const { rootNodes, errors } = ngHtmlParser.parse(input.selectedText);
  console.log(rootNodes, errors);
  return {
    originTemplateReplacement: getReplacement(input),
    files: [getComponentTemplateChange(input)],
  };
};

/**
 * Get the replacement code of the child component's template
 * @param param0 Input parameter
 * @returns New Template code of child component
 */
const getReplacement = ({ componentName, config }: Input): string => {
  return `<${config.defaultPrefix}-${componentName}></${config.defaultPrefix}-${componentName}>`;
};

/**
 * Get the file change information of the component
 * @param param0 Input parameter
 * @returns FileChange information
 */
const getComponentTemplateChange = ({
  directory,
  componentName,
  selectedText,
}: Input): FileChange => {
  return {
    content: selectedText,
    path: path.join(
      directory,
      componentName,
      `${componentName}.component.html`
    ),
    type: "replace",
  };
};
