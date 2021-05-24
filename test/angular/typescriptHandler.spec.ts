import { TSComponentHandler } from "../../src/angular";
import { expectCodeMatch } from "../utils";

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
    const code = tsHandler.addInput("test").print().code;
    expectCodeMatch(
      code,
      `@Input()
        test: any;`
    );
  });
});
