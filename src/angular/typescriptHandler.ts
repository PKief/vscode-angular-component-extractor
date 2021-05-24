import { parse, print } from "recast";
import {
  anyTypeAnnotation,
  callExpression,
  ClassDeclaration,
  classProperty,
  decorator,
  ExportNamedDeclaration,
  File,
  identifier,
  Statement,
  typeAnnotation,
} from "@babel/types";
import { PrintResultType } from "recast/lib/printer";

export class TSComponentHandler {
  private ast: File;
  private component: ClassDeclaration;
  constructor(component: string) {
    this.ast = parse(component, {
      parser: require("recast/parsers/typescript"),
    });
    this.component = this.findComponentReference(this.ast);
  }

  print(): PrintResultType {
    return print(this.ast);
  }

  addInput(key: string): TSComponentHandler {
    const classProp = classProperty(
      identifier(key),
      undefined,
      typeAnnotation(anyTypeAnnotation()),
      [decorator(callExpression(identifier("Input"), []))]
    );
    this.component.body.body.unshift(classProp);
    return this;
  }

  private findComponentReference(ast: File): ClassDeclaration {
    const classDeclarations = ast.program.body
      .filter(isExportNamedDeclaration)
      .map((node) => node.declaration)
      .filter(notNullOrUndefined)
      .filter(isClassDeclaration);
    if (classDeclarations.length === 0) {
      throw new Error("No class declaration found");
    }
    if (classDeclarations.length > 1) {
      console.log(`In this file are more that one class declarations`);
    }
    return classDeclarations[0];
  }
}

function notNullOrUndefined<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null;
}

function isExportNamedDeclaration(
  node: Statement
): node is ExportNamedDeclaration {
  return node.type === "ExportNamedDeclaration";
}

function isClassDeclaration(node: Statement): node is ClassDeclaration {
  return node.type === "ClassDeclaration";
}
