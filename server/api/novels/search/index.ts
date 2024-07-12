import type { DefineMethods } from 'aspida';

export type Methods = DefineMethods<{
  get: {
    query: {
      search: string | number;
    };
    resBody: Array<{
      workId: number;
      title: string;
      authorSurname: string;
      authorGivenName: string | null;
    }> | null;
  };
}>;
