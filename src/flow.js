import FlowNode from "./flowNode.js";

class Flow {
  constructor(name) {
    this.name = name;
    this.nodes = new Map();
    this.errorHandler = null;
  }

  step(name, code) {
    if (this.nodes.has(name)) {
      throw new Error(`Step with name '${name}' already exists.`);
    }
    const node = new FlowNode({ name, code });
    this.nodes.set(name, node);
    return {
      dependsOn: (...dependencies) => {
        // Check if all dependencies exist
        dependencies.forEach((dep) => {
          if (!this.nodes.has(dep)) {
            throw new Error(
              `Dependency '${dep}' not found for step '${name}'.`
            );
          }
        });
        node.dependencies = dependencies;
      },
    };
  }

  onError(callback) {
    this.errorHandler = callback;
  }

  async run() {
    const results = new Map();

    for (const [name, node] of this.nodes.entries()) {
      const dependenciesMet = node.dependencies.every((dep) =>
        results.has(dep)
      );
      if (!dependenciesMet) continue;

      const dependencyData = node.dependencies.reduce((acc, dep) => {
        acc[dep] = results.get(dep).data;
        return acc;
      }, {});

      const result = await node.run(dependencyData);
      results.set(name, result);

      if (!result.success && this.errorHandler) {
        this.errorHandler(name, result.error);
      }
    }
  }

  visualize() {
    console.table(
      Array.from(this.nodes.values()).map((node) => ({
        Step: node.name,
        Dependencies: node.dependencies.join(", "),
      }))
    );
  }

  toDot() {
    let dotGraph = ["digraph " + this.name + " {"];
    this.nodes.forEach((node) => {
      dotGraph.push(`    "${node.name}";`);
      node.dependencies.forEach((dep) => {
        dotGraph.push(`    "${dep}" -> "${node.name}";`);
      });
    });
    dotGraph.push("}");
    return dotGraph.join("\n");
  }
}

export default Flow;
