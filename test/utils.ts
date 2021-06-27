import { expect } from "chai";
import sinon, { StubbedInstance, stubInterface } from "ts-sinon";
import * as Logger from "../src/utils/logger";
import { IVSCodeExtLogger } from "@vscode-logging/logger";

type AnyFunction = (...args: any[]) => any;

export type Stub<T extends AnyFunction> = sinon.SinonStub<
  Parameters<T>,
  ReturnType<T>
>;

export function stub<T extends AnyFunction>(): Stub<T> {
  return sinon.stub();
}

export function expectCodeMatch(result: string, expected: string): void {
  expect(removeLineBreaksAndSpaces(result)).to.contain(
    removeLineBreaksAndSpaces(expected)
  );
}

export function removeLineBreaksAndSpaces(input: string): string {
  return input.replace(/(\r\n?|\n)+/g, "").replace(/ {2,}/g, " ");
}

export function setupSandbox(): void {
  let sandbox: sinon.SinonSandbox;

  before(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });
}

export function stubLogger(): StubbedInstance<IVSCodeExtLogger> {
  const logger = stubInterface<IVSCodeExtLogger>();
  sinon.stub(Logger, "getLogger").returns(logger);
  return logger;
}
