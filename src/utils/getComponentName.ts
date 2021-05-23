import { VSCodeAbstraction } from "../types";

/**
 * Prompt the user to enter the name of the component which will be created
 * @returns Promise of the component name
 */
export const getComponentName = (
  showInputBox: VSCodeAbstraction.ShowInputBox
): Thenable<string | undefined> =>
  showInputBox({
    placeHolder: "Component name",
    prompt: "Enter component name",
    validateInput: (input: string) => {
      // only lower or upper case letters and dashes allowed
      const pattern = new RegExp(/^[a-z\-]+$/i);

      return pattern.test(input)
        ? undefined
        : "Please enter a valid component name";
    },
  });
