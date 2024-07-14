import type { DefineMethods } from 'aspida';

export type Methods = DefineMethods<{
  get: {
    query: {
      name: string;
    };
    resBody: { title: string }[];
  };
}>;
