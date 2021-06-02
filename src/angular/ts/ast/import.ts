import {
  identifier,
  importDeclaration,
  ImportDeclaration,
  importSpecifier,
  ImportSpecifier,
  stringLiteral,
} from "@babel/types";

export interface ImportData {
  identifier: string;
  packageName: string;
}

export interface ImportBuilder {
  setPackageName(packageName: ImportData["packageName"]): ImportBuilder;
  setIdentifier(identifier: ImportData["identifier"]): ImportBuilder;
  /**
   * @returns ImportSpecifier is returned if there is already an import statement for the given package, otherwise its an ImportDeclaration
   */
  build(): ImportSpecifier | ImportDeclaration;
}

export function importBuilder(
  existingImport: ImportDeclaration
): ImportBuilder {
  const importData: Partial<ImportData> = {};
  const importBuilder: ImportBuilder = {
    setPackageName(packageName) {
      importData.packageName = packageName;
      return importBuilder;
    },
    setIdentifier(identifier) {
      importData.identifier = identifier;
      return importBuilder;
    },
    build() {
      if (importData.identifier === undefined) {
        throw new Error("Missing an identifier that should be imported");
      }
      if (importData.packageName === undefined) {
        throw new Error(
          `Missing a package name for the to be imported identifier '${importData.identifier}'`
        );
      }

      const impIdentifier = identifier(importData.identifier);
      const impSpecifier = importSpecifier(impIdentifier, impIdentifier);
      if (existingImport !== undefined) {
        return impSpecifier;
      }
      const packageSource = stringLiteral(importData.packageName);
      return importDeclaration([impSpecifier], packageSource);
    },
  };
  return importBuilder;
}
