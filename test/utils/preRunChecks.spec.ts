import { preRunChecks } from "../../src/utils";
import sinon, { stubConstructor, stubInterface, stubObject } from "ts-sinon";
import { expect } from "chai";
import {
  Diagnostic,
  Extension,
  Selection,
  TextDocument,
  TextEditor,
} from "vscode";
import { Stub } from "../utils";
const tsSinon = { stubConstructor, stubInterface, stubObject };

type FunctionPrarmeters = Parameters<typeof preRunChecks>;

describe("Utils preRunChecks", () => {
  let getExtension: Stub<FunctionPrarmeters[1]>;
  let getDiagnostics: Stub<FunctionPrarmeters[2]>;

  before(() => {
    getExtension = sinon.stub();
    getDiagnostics = sinon.stub();
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should not succeed with an undefined editor", () => {
    expect(preRunChecks(undefined, getExtension, getDiagnostics)).to.equal(
      undefined
    );
  });

  it("should not succeed if the Angular Language Server is missing", () => {
    expect(
      preRunChecks(
        tsSinon.stubInterface<TextEditor>(),
        getExtension.returns(undefined),
        getDiagnostics
      )
    ).to.equal(undefined);
  });

  it("should not succeed if there are compilation errors within the document", () => {
    // const test = tsSinon.stubInterface<InstanceType<Diagnostic>>();
    expect(
      preRunChecks(
        {
          document: tsSinon.stubInterface<TextDocument>(),
          selection: tsSinon.stubInterface<Selection>(),
        },
        getExtension.returns(tsSinon.stubInterface<Extension<unknown>>()),
        getDiagnostics.returns([])
      )
    ).to.equal(undefined);
  });
});
