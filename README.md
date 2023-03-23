# Node Context Storage

A simple utility for managing a context across asynchronous boundaries. It uses
Node.js's built-in `AsyncLocalStorage` module to allow context to be accessed
across multiple async functions without the need to explicitly pass it as a
parameter.

## Installation

To install, simply run:

npm:

```bash
npm install node-context-storage
```

pnpm:

```bash
pnpm add node-context-storage
```

## Usage

The library exports the function `createContext`, which can be used to create a
new context. Here's an example of how you might use it:

```ts
import { createContext } from "node-context-storage";

type MyContext = {
  userId: string;
  isAdmin: boolean;
};

const context = createContext();

context.run({ context: { userId: "123", isAdmin: true } }, async () => {
  // This async function has access to the context
  console.log(context.get()); // { userId: '123', isAdmin: true }

  await someOtherAsyncFunction();

  console.log(context.get()); // { userId: '123', isAdmin: true }
});
```

The `run` method takes an initial storage object, which can be used to set up
the initial state of the context. The `get`, `set`, and `exists` methods can be
used to access and modify the context within the async function.

## Express Middleware

The `createContextMiddleware` function is a built-in middleware for Express that
allows you to automatically set up the context for every request. Here's an
example of how you might use it:

```ts
import express from "express";
import { createContext, createContextMiddleware } from "node-context-storage";

type MyContext = {
  userId: string;
  isAdmin: boolean;
};

const context = createContext();

const contextMiddleware = createContextMiddleware<Context>(context);

const app = express();

app.use((req, res, next) =>
  contextMiddleware({ userId: "123", isAdmin: false }, req, res, next)
);

app.use((req, res, next) => {
  context.set({ isAdmin: true });
});

app.get("/api/my-route", (req, res) => {
  // This async function has access to the context
  console.log(context.get()); // { userId: '123', isAdmin: true }

  // ...
});
```

The `createContextMiddleware` function takes a `ContextAPI` object as an
argument and returns a custom Express middleware function that accept an initial
state for the current context (the express request) as it's first parameter.
Which essentialy uses context.run() and calls next() inside it under the hood.

You can then access the context within your route handlers using the `get`
method of the `ContextAPI` object. Here's an example:

```ts
app.get("/api/my-route", async (req, res) => {
  const userId = req.params.userId;

  // Set the userId in the context
  context.set({ userId });

  // ...

  // Get the current context
  const currentContext = context.get();

  // ...
});
```

Note that because the context is set up using `AsyncLocalStorage`, the context
is automatically destroyed when the async function completes, ensuring that
there are no memory leaks.

## API

### `createContext(): ContextAPI`

Creates a new context with the specified type parameter. Returns an object with
the following methods:

- `getStore(): Storage`: Returns the current storage object for the context.
  Throws an error if called outside of an async function where the context has
  not been set up.
- `get(): Context`: Returns the current context object. Throws an error if
  called outside of an async function where the context has not been set up.
- `set(context: Partial): void`: Merges the given partial context object into
  the current context object.
- `exists(): boolean`: Returns true if the context has been set up within the
  current async function, false otherwise.
- `run(initialStorage: Storage, cb: Function): Promise`: Runs the given async
  function with the provided initial storage object. The async function will
  have access to the context via the `get`, `set`, and `exists` methods.

### `ContextAPI`

The type of the object returned by `createContext`.

```ts
type ContextAPI<Context> = {
  type Storage = {
    context: Context;
  };

  getStore(): Storage;
  get(): Context;
  set(context: Partial<Context>): void;
  exists(): boolean;
  run(initialStorage: Storage, cb: Function): Promise<void>;
};
```

## License

This library is released under the
[MIT License](https://opensource.org/licenses/MIT).
