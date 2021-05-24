import { parse as ngParseHtml } from "angular-html-parser";
import { expect } from "chai";
import { getLiterals } from "../../src/angular/angularTemplateHandler";
describe("Angular template handler", () => {
  describe("getLiterals", () => {
    it("should not find any literals if there are non", () => {
      const input = `<button></button>`;
      const { rootNodes } = ngParseHtml(input);
      const result = getLiterals(rootNodes);
      expect(result.length).to.equal(0);
    });

    it("should find a single literal", () => {
      const input = `<button>{{any value}}</button>`;
      const { rootNodes } = ngParseHtml(input);
      const result = getLiterals(rootNodes);
      expect(result.length).to.equal(1);
      const [literalOne] = result[0].matches;
      expect(literalOne.groups).to.deep.equal(["any value"]);
    });

    it("should find a single literal and ignore content which is not part of the literal", () => {
      const input = `<button>This is not part of the value{{any value}}</button>`;
      const { rootNodes } = ngParseHtml(input);
      const result = getLiterals(rootNodes);
      expect(result.length).to.equal(1);
      const [literalOne] = result[0].matches;
      expect(literalOne.groups).to.deep.equal(["any value"]);
    });

    it("should find multiple literals within the same text", () => {
      const input = `<button>This is not part of the value{{any value}} Some more text thats not captured {{any other value}}</button>`;
      const { rootNodes } = ngParseHtml(input);
      const result = getLiterals(rootNodes);
      expect(result.length).to.equal(1);
      console.log(result);
      const [literalOne, literalTwo] = result[0].matches;
      expect(literalOne.groups).to.deep.equal(["any value"]);
      expect(literalTwo.groups).to.deep.equal(["any other value"]);
    });
  });
});
