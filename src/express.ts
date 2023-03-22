import type { Request, Response, NextFunction } from 'express';
import type { ContextAPI } from './index.js';

export const createContextMiddleware = <Context>(contextAPI: ContextAPI<Context>) => {
  return (context: Context, req: Request, res: Response, next: NextFunction) => contextAPI.run({ context }, () => next());
}
