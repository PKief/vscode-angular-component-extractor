import {
  ClassDeclaration,
  ExportNamedDeclaration,
  ImportDeclaration,
  ImportDefaultSpecifier,
  ImportNamespaceSpecifier,
  ImportSpecifier,
  Statement,
} from "@babel/types";

export function notNullOrUndefined<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null;
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
