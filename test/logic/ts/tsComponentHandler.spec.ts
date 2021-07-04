import { expect } from "chai";
import { TSComponentHandler } from "../../../src/logic/ts";
import { expectCodeMatch, removeLineBreaksAndSpaces } from "../../utils";

describe("Angular typescript handler", () => {
  it("find component", () => {
    const tsHandler = new TSComponentHandler(`
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  constructor() { }
  ngOnInit(): void {
  }
}
    `);
    const code = tsHandler.addInput("test").stringify();
    expectCodeMatch(
      code,
      `@Input()
        test: any;`
    );
    expectImportMatch(code, "Input", "@angular/core");
  });
});

function expectImportMatch(code: string, imp: string, pkg: string): void {
  const regExpImportStatement = RegExp(
    `import \\{.*?${imp}.*?\\} from '${pkg}'`,
    "g"
  );
  expect(removeLineBreaksAndSpaces(code)).to.match(regExpImportStatement);
}
