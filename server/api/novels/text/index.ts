import type { DefineMethods } from 'aspida';

export type Methods = DefineMethods<{
  get: {
    query: {
      workId: number;
    };
    resBody: string | null;
  };
}>;
