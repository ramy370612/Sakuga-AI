import type { RankingInfo } from 'api/@types/novel';
import type { DefineMethods } from 'aspida';
export type Methods = DefineMethods<{
  get: {
    query: {
      limit: number;
    };
    resBody: RankingInfo[];
  };
}>;
