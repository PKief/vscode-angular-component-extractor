import {
  ClassDeclaration,
  ClassMethod,
  ClassPrivateMethod,
  ClassPrivateProperty,
  ClassProperty,
  ExportNamedDeclaration,
  File,
  Identifier,
  ImportDeclaration,
  ImportDefaultSpecifier,
  ImportNamespaceSpecifier,
  ImportSpecifier,
  Statement,
  StringLiteral,
  TSDeclareMethod,
  TSIndexSignature,
} from "@babel/types";
import * as babel from "@babel/types";

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
  return babel.isExportNamedDeclaration(node);
}

export function isClassDeclaration(node: Statement): node is ClassDeclaration {
  return babel.isClassDeclaration(node);
}

export function isImportDeclaration(
  node: Statement
): node is ImportDeclaration {
  return babel.isImportDeclaration(node);
}

export function isImportSpecifier(
  node: ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier
): node is ImportSpecifier {
  return babel.isImportSpecifier(node);
}

export function getSpecifierAsString(
  specifier: StringLiteral | Identifier
): string {
  if (babel.isStringLiteral(specifier)) {
    return specifier.value;
  }
  return specifier.name;
}

export function addCodeAtBeginning(
  code: Statement[],
  newLine: Statement
): void {
  code.unshift(newLine);
}
export function addStatementToComponent(
  component: ClassDeclaration,
  statement: ComponentFirstCitizenStatement
): void {
  getComponentCode(component).unshift(statement);
}
