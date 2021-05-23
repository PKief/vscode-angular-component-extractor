import { expect } from "chai";
import { convert, Input } from "../../src/angular/convert";
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
    const result = convert(input);
    expect(result).to.deep.equal(expectedOutput);
  });
});
