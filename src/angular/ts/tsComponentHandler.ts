import { parse, print } from "recast";
import { ClassDeclaration, File } from "@babel/types";
import { notNullOrUndefined, TSImportHandler } from ".";
import {
  addStatementToComponent,
  componentPropertyBuilder,
  getCode,
  isClassDeclaration,
  isExportNamedDeclaration,
} from "./ast";
import { getLogger } from "../../utils/logger";

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
    const classProp = componentPropertyBuilder()
      .setKey(key)
      .setDecorator("Input")
      .build();
    addStatementToComponent(this.component, classProp);
    this.importHandler.ensureThatImportExists("Input", "@angular/core");
    return this;
  }

  /**
   * find the component declaration of the passed typescript file
   * @param ast
   * @returns
   */
  private findComponentReference(ast: File): ClassDeclaration {
    const classDeclarations = getCode(ast)
      .filter(isExportNamedDeclaration)
      .map((node) => node.declaration)
      .filter(notNullOrUndefined)
      .filter(isClassDeclaration);

    if (classDeclarations.length === 0) {
      throw new Error("No class declaration found");
    }
    if (classDeclarations.length > 1) {
      getLogger()
        .getChildLogger({ label: "typescript" })
        .warn(`In this file are more that one class declarations`);
    }
    return classDeclarations[0];
  }
}
