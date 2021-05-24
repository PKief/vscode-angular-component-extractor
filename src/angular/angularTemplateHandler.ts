import { Node, Text } from "angular-html-parser/lib/compiler/src/ml_parser/ast";

export interface TemplateLiteral {
  node: Text;
  matches: RegExpExecArray;
}

export function getLiterals(rootNodes: Node[]): TemplateLiteral[] {
  const literalMatcher = /\{\{(.*)\}\}/g;
  return flatDeep(rootNodes)
    .filter(textNodeGuard)
    .map((node) => ({ node, matches: literalMatcher.exec(node.value) }))
    .filter(matchesIsNotNull)
    .filter((tempLiteral) => tempLiteral.matches.length > 0);
}

function matchesIsNotNull(tempLiteral: {
  node: Text;
  matches: RegExpExecArray | null;
}): tempLiteral is TemplateLiteral {
  return tempLiteral.matches !== null;
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
