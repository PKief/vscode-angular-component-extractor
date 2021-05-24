import { expect } from "chai";
import sinon from "ts-sinon";

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

function removeLineBreaksAndSpaces(input: string): string {
  return input.replace(/\n+/g, "").replace(/ {2,}/g, " ");
}
