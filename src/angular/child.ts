import * as path from "path";
import * as vscode from "vscode";

/**
 * Insert the selected template code into the template of the child component
 * @param directory Directory of the child component
 * @param componentName Name of the child component
 * @param content Selected content of the parent component
 */
export const writeChildTemplate = (
  directory: string,
  componentName: string,
  content: string
) => {
  const componentPath = path.join(
    directory,
    componentName,
    `${componentName}.component.html`
  );
  const componentUri = vscode.Uri.file(componentPath);
  vscode.workspace.fs.writeFile(componentUri, Buffer.from(content));
};
