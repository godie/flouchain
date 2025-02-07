import { jest } from "@jest/globals";

import Flow from "../src/flow.js";

describe("Flow", () => {
  test("Executes steps without dependencies without errors", async () => {
    const flow = new Flow("testFlowNoDeps");
    flow.step("step1", async () => "data1");
    flow.step("step2", async () => "data2");

    const onError = jest.fn();
    flow.onError(onError);

    await flow.run();

    // onError should not be called
    expect(onError).not.toBeCalled();
  });

  test("Executes steps with dependencies", async () => {
    const flow = new Flow("testFlowWithDeps");

    flow.step("A", async () => {
      return "dataA";
    });

    flow
      .step("B", async (data) => {
        expect(data.A).toBe("dataA");
        return "dataB";
      })
      .dependsOn("A");

    flow
      .step("C", async (data) => {
        expect(data.B).toBe("dataB");
        return "dataC";
      })
      .dependsOn("B");

    const onError = jest.fn();
    flow.onError(onError);
    await flow.run();

    // onError should not be called
    expect(onError).not.toBeCalled();
  });

  test("Handles a failing step and invokes error callback", async () => {
    const flow = new Flow("testFlowError");
    flow.step("failStep", async () => {
      throw new Error("Intentional fail");
    });

    const onError = jest.fn();
    flow.onError(onError);
    await flow.run();

    // onError is expected to be called with 'failStep' and its error
    expect(onError).toBeCalledWith("failStep", expect.any(Error));
    expect(onError.mock.calls[0][1].message).toMatch(/Intentional fail/);
  });

  test("Does not allow registering duplicate step names", () => {
    const flow = new Flow("testFlowDuplicate");
    flow.step("D", async () => "dataD");
    expect(() => {
      // Register the same step 'D'
      flow.step("D", async () => "anotherDataD");
    }).toThrow("Step with name 'D' already exists.");
  });

  test("Throws error when a dependency does not exist", () => {
    const flow = new Flow("testFlowDepError");
    flow.step("E", async () => "dataE");
    expect(() => {
      flow.step("F", async () => "dataF").dependsOn("G"); // 'G' does not exist
    }).toThrow("Dependency 'G' not found for step 'F'.");
  });

  test("Passes data correctly between dependent steps", async () => {
    const flow = new Flow("testFlowData");

    // Step A returns a simple number
    flow.step("A", async () => {
      return 123;
    });

    // Step B depends on A and expects to receive { A: 123 } as data
    flow
      .step("B", async (data) => {
        expect(data.A).toBe(123);
        return { fromB: "hello" };
      })
      .dependsOn("A");

    // Step C depends on B and expects to receive { B: { fromB: "hello" } }
    flow
      .step("C", async (data) => {
        expect(data.B).toEqual({ fromB: "hello" });
        return "done";
      })
      .dependsOn("B");

    const onError = jest.fn();
    flow.onError(onError);

    await flow.run();

    // onError should not be called
    expect(onError).not.toBeCalled();
  });

  test("Executes step with multiple dependencies", async () => {
    const flow = new Flow("testFlowMultiDeps");

    // Step X returns a string
    flow.step("X", async () => {
      return "X data";
    });

    // Step Y returns a number
    flow.step("Y", async () => {
      return 999;
    });

    /* Step Z depends on X and Y.
       It should receive:
       data = {
         X: "X data",
         Y: 999
       }
    */
    flow
      .step("Z", async (data) => {
        expect(data.X).toBe("X data");
        expect(data.Y).toBe(999);
        return "Z done";
      })
      .dependsOn("X", "Y");

    const onError = jest.fn();
    flow.onError(onError);

    await flow.run();

    // onError should not be called
    expect(onError).not.toBeCalled();
  });
});
