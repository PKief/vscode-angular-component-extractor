import { File, ImportDeclaration } from "@babel/types";
import {
  addCodeAtBeginning,
  getCode,
  getSpecifierAsString,
  isImportDeclaration,
  isImportSpecifier,
} from "./ast";
import { importBuilder } from "./ast/import";

interface ImportStatement {
  specifier: string;
  packageSource: string;
}

/**
 * Responsible for the imports
 */
export class TSImportHandler {
  private containsImport: ImportStatement[];
  constructor(private ast: File) {
    this.containsImport = [];
  }

  ensureThatImportExists(imp: string, pkg: string): void {
    if (this.checkImport(imp, pkg)) {
      return;
    }
    this.addImportDeclaration(imp, pkg);
  }

  /**
   * Check if the import already is present
   * @param imp what should be imported
   * @param pkg from which package
   * @returns
   */
  private checkImport(imp: string, pkg: string): boolean {
    const hasImport = ({ specifier, packageSource }: ImportStatement) =>
      specifier === imp && packageSource === pkg;

    if (this.containsImport.some(hasImport)) {
      return true;
    }
    const importAlreadyExists = this.getImportDeclarationByPackage(pkg)
      .map(({ source, specifiers }) => ({
        source,
        specifiers: specifiers.filter(isImportSpecifier),
      }))
      .filter(({ specifiers }) => specifiers.length > 0)
      .flatMap(({ source, specifiers }) =>
        specifiers.map(
          (specifier): ImportStatement => ({
            specifier: getSpecifierAsString(specifier.imported),
            packageSource: source.value,
          })
        )
      )
      .some(hasImport);
    if (importAlreadyExists) {
      this.containsImport.push({ specifier: imp, packageSource: pkg });
    }
    return importAlreadyExists;
  }

  private getImportDeclarationByPackage(pkg: string): ImportDeclaration[] {
    return getCode(this.ast)
      .filter(isImportDeclaration)
      .filter(({ source }) => source.value === pkg);
  }

  /**
   * Add an import to the file
   * @param imp
   * @param pkg
   */
  private addImportDeclaration(imp: string, pkg: string): void {
    const [existingImport] = this.getImportDeclarationByPackage(pkg);
    const importResult = importBuilder(existingImport)
      .setIdentifier(imp)
      .setPackageName(pkg)
      .build();

    if (isImportDeclaration(importResult)) {
      addCodeAtBeginning(getCode(this.ast), importResult);
    } else {
      existingImport.specifiers.push(importResult);
    }
    this.containsImport.push({ packageSource: pkg, specifier: imp });
  }
}
