import * as ngHtmlParser from "angular-html-parser";
import * as path from "path";
import { Changes, Config, FileChange } from "../types";
import { getInterpolations, TemplateInterpolation } from "./angular";
import { TSComponentHandler } from "./ts";

export interface Input {
  directory: string;
  componentName: string;
  selectedText: string;
  config: Config;
}

interface Interpolation {
  text: string;
}

/**
 * Convert component information into Changes object
 * @param input Input for a component change
 * @returns Changes object
 */
export const getChanges = (input: Input): Changes => {
  const { rootNodes, errors } = ngHtmlParser.parse(input.selectedText);
  const interpolations = getInterpolationTexts(getInterpolations(rootNodes));
  const changes = {
    originTemplateReplacement: getReplacement(input, interpolations),
    files: [getComponentTemplateChange(input)],
  };
  if (interpolations.length > 0) {
    changes.files.push(getComponentTypeScriptChange(input, interpolations));
  }
  return changes;
};

function getInterpolationTexts(
  interpolations: TemplateInterpolation[]
): Interpolation[] {
  return interpolations.flatMap((interpolation) =>
    interpolation.matches.map((match) => ({ text: match.groups[0].trim() }))
  );
}
/**
 * Get the replacement code of the child component's template
 * @param param0 Input parameter
 * @returns New Template code of child component
 */
const getReplacement = (
  { componentName, config }: Input,
  interpolations: Interpolation[]
): string => {
  const attributes = interpolations.reduce((acc, interpolation) => {
    return `${acc} [${interpolation.text}]="${interpolation.text}"`;
  }, "");
  return `<${config.defaultPrefix}-${componentName}${attributes}></${config.defaultPrefix}-${componentName}>`;
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

const getComponentTypeScriptChange = (
  { directory, componentName }: Input,
  interpolations: Interpolation[]
): FileChange => {
  return {
    newContent: (content: string) => {
      const tsHandler = new TSComponentHandler(content);
      interpolations.forEach((interpolation) =>
        tsHandler.addInput(interpolation.text)
      );
      return tsHandler.stringify();
    },
    path: path.join(directory, componentName, `${componentName}.component.ts`),
    type: "update",
  };
};
