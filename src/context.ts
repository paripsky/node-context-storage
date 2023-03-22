import { AsyncLocalStorage } from 'async_hooks';

export const createContext = <Context>() => {
  type Storage = {
    context: Context;
  };

  const asyncLocalStorage = new AsyncLocalStorage<Storage>();

  const getStore = () => {
    const store = asyncLocalStorage.getStore();

    if (!store) {
      throw new Error('Context not found, make sure you added the contextMiddleware in routes that use getStore()');
    }

    return store;
  };

  const get = () => getStore().context;

  const exists = () => {
    try {
      return !!getStore()?.context;
    } catch {
      return false;
    }
  };

  const set = (context: Partial<Context>) => {
    const store = getStore();

    store.context = { ...store.context, ...context };
  };

  const run = (initialStorage: Storage, cb: Function) => asyncLocalStorage.run(initialStorage, () => cb());

  return {
    getStore,
    get,
    set,
    exists,
    run,
  };
}

export type ContextAPI<Context> = ReturnType<typeof createContext<Context>>;
