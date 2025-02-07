import FlowNode from "../src/flowNode.js";

describe("FlowNode", () => {
  test("Executes the node successfully and resolves the value", async () => {
    const node = new FlowNode({
      name: "successNode",
      code: async () => {
        return "OK";
      },
    });

    const result = await node.run({});
    expect(result.success).toBe(true);
    expect(result.data).toBe("OK");
  });

  test("Returns an error when the node's function throws an exception", async () => {
    const node = new FlowNode({
      name: "errorNode",
      code: async () => {
        throw new Error("Test Error");
      },
    });

    const result = await node.run({});
    expect(result.success).toBe(false);
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error.message).toBe("Test Error");
  });

  test("Returns an error if the 'code' property is not a function", async () => {
    const node = new FlowNode({
      name: "invalidCodeNode",
      // 'code' is not a function
      code: "not-a-function",
    });

    const result = await node.run({});
    expect(result.success).toBe(false);
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error.message).toMatch(/is not a function/);
  });
});
