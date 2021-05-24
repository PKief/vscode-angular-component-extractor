import { expect } from "chai";
import { getChanges, Input } from "../../src/angular";
import { Changes } from "../../src/types";

describe("Angular convert", () => {
  it("static content", () => {
    const input: Input = {
      directory: "/baseDir",
      componentName: "test",
      config: {
        defaultPrefix: "app",
      },
      selectedText: `<button>hello world</button>`,
    };
    const expectedOutput: Changes = {
      originTemplateReplacement: `<app-test></app-test>`,
      files: [
        {
          content: `<button>hello world</button>`,
          path: "/baseDir/test/test.component.html",
        },
      ],
    };
    const result = getChanges(input);
    expect(result).to.deep.equal(expectedOutput);
  });
});
