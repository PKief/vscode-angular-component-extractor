import * as ngHtmlParser from "angular-html-parser";
import * as path from "path";
import { Changes, Config, FileChange } from "../types";
import { getLiterals, TemplateLiteral } from "./angularTemplateHandler";
import { TSComponentHandler } from ".";

export interface Input {
  directory: string;
  componentName: string;
  selectedText: string;
  config: Config;
}

interface Literal {
  text: string;
}

/**
 * Convert component information into Changes object
 * @param input Input for a component change
 * @returns Changes object
 */
export const getChanges = (input: Input): Changes => {
  const { rootNodes, errors } = ngHtmlParser.parse(input.selectedText);
  const literals = getLiteralsTexts(getLiterals(rootNodes));
  const changes = {
    originTemplateReplacement: getReplacement(input, literals),
    files: [getComponentTemplateChange(input)],
  };
  if (literals.length > 0) {
    changes.files.push(getComponentTypeScriptChange(input, literals));
  }
  return changes;
};

function getLiteralsTexts(literals: TemplateLiteral[]): Literal[] {
  return literals.flatMap((literal) =>
    literal.matches.map((match) => ({ text: match.groups[0] }))
  );
}
/**
 * Get the replacement code of the child component's template
 * @param param0 Input parameter
 * @returns New Template code of child component
 */
const getReplacement = (
  { componentName, config }: Input,
  literals: Literal[]
): string => {
  const attributes = literals.reduce((acc, literal) => {
    return `${acc} [${literal.text}]="${literal.text}"`;
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
  literals: Literal[]
): FileChange => {
  return {
    newContent: (content: string) => {
      const tsHandler = new TSComponentHandler(content);
      literals.forEach((literal) => tsHandler.addInput(literal.text));
      return tsHandler.stringify();
    },
    path: path.join(directory, componentName, `${componentName}.component.ts`),
    type: "update",
  };
};
