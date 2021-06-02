import {
  ClassDeclaration,
  ClassMethod,
  ClassPrivateMethod,
  ClassPrivateProperty,
  ClassProperty,
  File,
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
