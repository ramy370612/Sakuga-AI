import type { DefineMethods } from 'aspida';

export type Methods = DefineMethods<{
  get: {
    query: {
      limit: number;
    };
    resBody:
      | {
          id: string;
          workId: number;
          title: string;
          titleReading: string;
          sortReading: string | null;
          publicationDate: string;
          lastUpdateDate: string;
          cardUrl: string;
          authorSurname: string;
          authorGivenName: string | null;
          authorSurnameReading: string;
          authorGivenNameReading: string | null;
          authorSurnameSortReading: string;
          authorGivenNameSortReading: string | null;
          authorSurnameRomaji: string;
          authorGivenNameRomaji: string | null;
          characterCount: number | null;
          openingSentence: string | null;
          totalAccessCount: number;
          htmlFileUrl: string;
          rank: number;
        }[]
      | null;
  };
}>;
