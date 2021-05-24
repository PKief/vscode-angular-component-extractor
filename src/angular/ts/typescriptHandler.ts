import { parse, print } from "recast";
import {
  anyTypeAnnotation,
  callExpression,
  ClassDeclaration,
  classProperty,
  decorator,
  File,
  identifier,
  typeAnnotation,
} from "@babel/types";
import {
  isClassDeclaration,
  isExportNamedDeclaration,
  notNullOrUndefined,
  TSImportHandler,
} from ".";

export class TSComponentHandler {
  private ast: File;
  private component: ClassDeclaration;
  private importHandler: TSImportHandler;

  /**
   *
   * @param component TypeScript code
   */
  constructor(component: string) {
    this.ast = parse(component, {
      parser: require("recast/parsers/typescript"),
    });
    this.component = this.findComponentReference(this.ast);
    this.importHandler = new TSImportHandler(this.ast);
  }

  /**
   * Get TypeScript the code
   * @returns
   */
  stringify(): string {
    return print(this.ast).code;
  }

  /**
   * Add an input class property
   * @param key The name of the Input
   * @returns self reference
   */
  addInput(key: string): TSComponentHandler {
    const classProp = classProperty(
      identifier(key),
      undefined,
      typeAnnotation(anyTypeAnnotation()),
      [decorator(callExpression(identifier("Input"), []))]
    );
    this.component.body.body.unshift(classProp);
    this.importHandler.ensureThatImportExists("Input", "@angular/core");
    return this;
  }

  /**
   * find the component declaration of the passed typescript file
   * @param ast
   * @returns
   */
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
