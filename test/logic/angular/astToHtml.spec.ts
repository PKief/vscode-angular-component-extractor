import { parse as ngParseHtml } from "angular-html-parser";
import { expect } from "chai";
import { astToHtml } from "../../../src/logic/angular";

describe("Angular astToHtml", () => {
  const testParser = (input: string) => {
    const { rootNodes } = ngParseHtml(input);
    const result = astToHtml(rootNodes);
    expect(result).to.equal(input);
  };

  it("element", () => {
    testParser("<button></button>");
  });
  it("element with text", () => {
    testParser("<button>Some text</button>");
  });
  it("element with attribute", () => {
    testParser(`<button attr="some value"></button>`);
  });
  it("element with multiple attribute", () => {
    testParser(
      `<button attr="some value" attr2="some other value">Some text</button>`
    );
  });
  it("element with comment", () => {
    testParser(`<button><!-- some comment --></button>`);
  });
  it("element with angular binding", () => {
    testParser(`<button [attr]="some value"></button>`);
  });
  it("element with angular templating", () => {
    testParser(`<button *ngIf="some code"></button>`);
  });
  it("element with angular text", () => {
    testParser(`<button>{{some code}}</button>`);
  });
  it("element with cdata", () => {
    testParser(`<button><![CDATA[ haha ]]></button>`);
  });
  it("doctype declaration", () => {
    testParser(`<!DOCTYPE html><html><head></head><body></body></html>`);
  });
});
