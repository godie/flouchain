# Flouchain

Flouchain es una biblioteca ligera para manejar la ejecución de flujos de trabajo asíncronos con dependencias entre tareas en JavaScript.

## Características

- Definición de pasos en un flujo de trabajo.
- Encadenamiento de dependencias entre pasos.
- Manejo de errores centralizado.
- Representación visual del flujo con `toDot()`.
- Soporte para `async/await`.

## Instalación

```sh
npm install flouchain
```

## Uso

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
    console.log("Ejecutando Foo con", data);
  })
  .dependsOn("bar", "baz");

flow.onError((step, error) => {
  console.error(`Error en ${step}:`, error);
});

flow.visualize();
console.log(flow.toDot());
flow.run();
```

## API

### `new Flow(name)`

Crea un nuevo flujo de trabajo.

### `flow.step(name, asyncFunction)`

Define un nuevo paso en el flujo.

### `.dependsOn(...steps)`

Especifica dependencias entre pasos.

### `flow.run()`

Ejecuta el flujo de trabajo.

### `flow.onError(callback)`

Define un manejador de errores global.

### `flow.visualize()`

Muestra el flujo en formato de tabla en consola.

### `flow.toDot()`

Devuelve una representación en formato DOT para visualización con Graphviz.

## Pruebas

```sh
npm test
```

## Licencia

MIT
