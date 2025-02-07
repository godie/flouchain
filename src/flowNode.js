class FlowNode {
  constructor({ name, code, dependencies = [] }) {
    this.name = name;
    this.code = code;
    this.dependencies = dependencies;
    this.data = undefined;
    this.error = undefined;
  }

  async run(context) {
    try {
      this.data = await this.code(context);
      return { success: true, data: this.data };
    } catch (error) {
      this.error = error;
      return { success: false, error };
    }
  }
}

export default FlowNode;
