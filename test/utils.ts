type AnyFunction = (...args: any[]) => any;

export type Stub<T extends AnyFunction> = sinon.SinonStub<
  Parameters<T>,
  ReturnType<T>
>;
