import { Node, Text } from "angular-html-parser/lib/compiler/src/ml_parser/ast";

export interface RegExpMatch {
  match: string;
  groups: string[];
  index: number;
}

export interface TemplateInterpolation {
  node: Text;
  matches: RegExpMatch[];
}

export function getInterpolations(rootNodes: Node[]): TemplateInterpolation[] {
  const interpolationMatcher = /\{\{(.*?)\}\}/g;
  return flatDeep(rootNodes)
    .filter(textNodeGuard)
    .map((node) => ({
      node,
      matches: findMatches(node.value, interpolationMatcher),
    }))
    .filter((tempInterpolation) => tempInterpolation.matches.length > 0);
}

function findMatches(context: string, regex: RegExp): RegExpMatch[] {
  const results: RegExpMatch[] = [];
  let currentMatch = regex.exec(context);
  while (currentMatch !== null) {
    const { index } = currentMatch;
    const [match, ...groups] = currentMatch;
    results.push({
      groups,
      index,
      match,
    });
    currentMatch = regex.exec(context);
  }
  return results;
}

function textNodeGuard(node: Node): node is Text {
  return node.type === "text";
}

function flatDeep(nodes: Node[]): Node[] {
  return nodes.reduce(
    (acc, node) => [...acc, node, ...flatDeep(getChildren(node))],
    [] as Node[]
  );
}

function getChildren(node: Node): Node[] {
  return node.type === "element" ? node.children : [];
}
