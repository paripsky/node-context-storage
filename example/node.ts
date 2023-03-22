import { createContext } from '../src/index.js';

type Context = {
  id: string;
}

export const context = createContext<Context>();

const runExample = async () => {
  console.log(context.get().id)
}

const main = async () => {
  await Promise.all([1, 2, 3].map((i) => {
    context.run({ context: { id: String(i) } }, runExample);
  }));
}

main();
