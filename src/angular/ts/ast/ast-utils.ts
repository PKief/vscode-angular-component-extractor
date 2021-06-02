import {
  ClassDeclaration,
  ClassMethod,
  ClassPrivateMethod,
  ClassPrivateProperty,
  ClassProperty,
  ExportNamedDeclaration,
  File,
  ImportDeclaration,
  ImportDefaultSpecifier,
  ImportNamespaceSpecifier,
  ImportSpecifier,
  Statement,
  TSDeclareMethod,
  TSIndexSignature,
} from "@babel/types";

export type ComponentFirstCitizenStatement =
  | ClassMethod
  | ClassPrivateMethod
  | ClassProperty
  | ClassPrivateProperty
  | TSDeclareMethod
  | TSIndexSignature;

export function getCode(ast: File): Statement[] {
  return ast.program.body;
}

export function getComponentCode(
  component: ClassDeclaration
): ComponentFirstCitizenStatement[] {
  return component.body.body;
}

export function isExportNamedDeclaration(
  node: Statement
): node is ExportNamedDeclaration {
  return node.type === "ExportNamedDeclaration";
}

export function isClassDeclaration(node: Statement): node is ClassDeclaration {
  return node.type === "ClassDeclaration";
}

export function isImportDeclaration(
  node: Statement
): node is ImportDeclaration {
  return node.type === "ImportDeclaration";
}

export function isImportSpecifier(
  node: ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier
): node is ImportSpecifier {
  return node.type === "ImportSpecifier";
}
