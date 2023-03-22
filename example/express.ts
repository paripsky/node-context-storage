import { createContext, createContextMiddleware } from '../src/index.js';

type Context = {
  id: string;
}

export const context = createContext<Context>();

const contextMiddleware = createContextMiddleware<Context>(context);

var app;
(app as any).use((req: any, res: any, next: any) => {
  contextMiddleware({ id: 'some-req-id' }, req, res, next);
});
