import sinon from "ts-sinon";

type AnyFunction = (...args: any[]) => any;

export type Stub<T extends AnyFunction> = sinon.SinonStub<
  Parameters<T>,
  ReturnType<T>
>;

export function stub<T extends AnyFunction>(): Stub<T> {
  return sinon.stub();
}
