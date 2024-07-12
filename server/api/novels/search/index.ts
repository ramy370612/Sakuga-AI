import type { DefineMethods } from 'aspida';

export type Methods = DefineMethods<{
  get: {
    query: {
      searchAuthors: string;
    };
    resBody: Array<{
      title: string;
      authorSurname: string;
      authorGivenName: string | null;
    }> | null;
  };
}>;
