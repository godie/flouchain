# flouchain

Flow.js is a lightweight library for handling the execution of asynchronous workflows with dependencies between tasks in JavaScript.

## Features

- Define steps in a workflow.
- Chain dependencies between steps.
- Centralized error handling.
- Visual representation of the workflow with `toDot()`.
- Supports `async/await`.

## Installation

```sh
npm install flouchain
```

## Usage

```javascript
import Flow from "flouchain";

const flow = new Flow("test");

flow.step("bar", async () => {
  return await someAsyncFn();
});

flow.step("baz", async () => {
  return await anotherAsyncFn();
});

flow
  .step("foo", async (data) => {
    console.log("Executing Foo with", data);
  })
  .dependsOn("bar", "baz");

flow.onError((step, error) => {
  console.error(`Error in ${step}:`, error);
});

flow.visualize();
console.log(flow.toDot());
flow.run();
```

## API

### `new Flow(name)`

Creates a new workflow.

### `flow.step(name, asyncFunction)`

Defines a new step in the workflow.

### `.dependsOn(...steps)`

Specifies dependencies between steps.

### `flow.run()`

Executes the workflow.

### `flow.onError(callback)`

Defines a global error handler.

###
