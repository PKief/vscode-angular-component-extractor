import { expect } from "chai";
import { TSComponentHandler } from "../../src/angular";

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
    const code = tsHandler.addInput("test", "any").print().code;
    expectCodeMatch(
      code,
      `@Input()
        test: any;`
    );
  });
});

function expectCodeMatch(result: string, expected: string): void {
  expect(removeLineBreaksAndSpaces(result)).to.contain(
    removeLineBreaksAndSpaces(expected)
  );
}

function removeLineBreaksAndSpaces(input: string): string {
  return input.replace(/\n+/g, "").replace(/ {2,}/g, " ");
}
