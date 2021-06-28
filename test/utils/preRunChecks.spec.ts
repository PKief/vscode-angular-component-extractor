import { preRunChecks } from "../../src/utils";
import sinon, { stubConstructor, stubInterface, stubObject } from "ts-sinon";
import { expect } from "chai";
import {
  Diagnostic,
  Extension,
  Range,
  Selection,
  TextDocument,
  TextEditor,
} from "vscode";
import { setupSandbox, stub, Stub, stubLogger } from "../utils";
const tsSinon = { stubConstructor, stubInterface, stubObject };

type FunctionParameters = Parameters<typeof preRunChecks>;

describe("Utils preRunChecks", () => {
  const getExtension: Stub<FunctionParameters[1]> = sinon.stub();
  const getDiagnostics: Stub<FunctionParameters[2]> = sinon.stub();
  const logger = stubLogger();
  setupSandbox();

  it("should not succeed with an undefined editor", () => {
    expect(preRunChecks(undefined, getExtension, getDiagnostics)).to.equal(
      undefined
    );
    expect(logger.error.called).to.be.true;
  });

  it("should not succeed if the Angular Language Server is missing", () => {
    expect(
      preRunChecks(
        tsSinon.stubInterface<TextEditor>(),
        getExtension.returns(undefined),
        getDiagnostics
      )
    ).to.equal(undefined);
    expect(logger.error.called).to.be.true;
  });

  it("should not succeed if there are compilation errors within the document", () => {
    const createDiagnostic = () =>
      (({
        range: {
          intersection: stub<Range["intersection"]>().returns({} as Range),
        },
      } as unknown) as Diagnostic);
    expect(
      preRunChecks(
        {
          document: tsSinon.stubInterface<TextDocument>(),
          selection: tsSinon.stubInterface<Selection>(),
        },
        getExtension.returns(tsSinon.stubInterface<Extension<unknown>>()),
        getDiagnostics.returns([createDiagnostic()])
      )
    ).to.equal(undefined);
    expect(logger.error.called).to.be.true;
  });

  it("should succeed if conditions are met", () => {
    const input = {
      document: tsSinon.stubInterface<TextDocument>(),
      selection: tsSinon.stubInterface<Selection>(),
    };
    expect(
      preRunChecks(
        input,
        getExtension.returns(tsSinon.stubInterface<Extension<unknown>>()),
        getDiagnostics.returns([])
      )
    ).to.deep.equal(input);
  });
  expect(logger.error.called).to.be.false;
});
