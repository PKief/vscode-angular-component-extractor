import {
  File,
  Identifier,
  identifier,
  importDeclaration,
  ImportDeclaration,
  importSpecifier,
  stringLiteral,
} from "@babel/types";
import { isImportDeclaration, isImportSpecifier } from "./ast";

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
            specifier: (specifier.imported as Identifier).name,
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
    return this.ast.program.body
      .filter(isImportDeclaration)
      .filter(({ source }) => source.value === pkg);
  }

  /**
   * Add an import to the file
   * @param imp
   * @param pkg
   */
  private addImportDeclaration(imp: string, pkg: string): void {
    const [existingImport] = this.getImportDeclarationByPackage(pkg).map(
      ({ source, specifiers }) => ({
        source,
        specifiers,
      })
    );
    const impIdentifier = identifier(imp);
    const impSpecifier = importSpecifier(impIdentifier, impIdentifier);
    if (existingImport !== undefined) {
      existingImport.specifiers.push(impSpecifier);
    } else {
      const packageSource = stringLiteral(pkg);
      const newImport = importDeclaration([impSpecifier], packageSource);
      this.ast.program.body.unshift(newImport);
    }
    this.containsImport.push({ packageSource: pkg, specifier: imp });
  }
}
