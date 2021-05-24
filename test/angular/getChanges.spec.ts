import { expect, use as chaiUse } from "chai";
import { getChanges, Input } from "../../src/angular";
import { Changes, FileChange, FileChangeUpdate } from "../../src/types";
import * as path from "path";
import chaiExclude from "chai-exclude";
import { expectCodeMatch } from "../utils";

chaiUse(chaiExclude);

describe("Angular getChanges", () => {
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
          type: "replace",
          path: path.join("/baseDir", "test", "test.component.html"),
        },
      ],
    };
    const result = getChanges(input);
    expect(result).to.deep.equal(expectedOutput);
  });
  it("static content with one template literal", () => {
    const input: Input = {
      directory: "/baseDir",
      componentName: "test",
      config: {
        defaultPrefix: "app",
      },
      selectedText: `<button>hello world {{title}}</button>`,
    };
    const expectedOutput: Changes = {
      originTemplateReplacement: `<app-test [title]="title"></app-test>`,
      files: [
        {
          type: "replace",
          content: `<button>hello world {{title}}</button>`,
          path: path.join("/baseDir", "test", "test.component.html"),
        },
        {
          type: "update",
          path: path.join("/baseDir", "test", "test.component.ts"),
        } as FileChange,
      ],
    };
    const result = getChanges(input);
    expect(result).excludingEvery("newContent").to.deep.equal(expectedOutput);

    const testComp = `
@Component()
export class TestComponent {}`;
    const newContent = (result.files.filter(
      (change) => change.type === "update"
    )[0] as FileChangeUpdate).newContent;
    expectCodeMatch(
      newContent(testComp),
      `@Input() 
       title: any`
    );
  });
});
