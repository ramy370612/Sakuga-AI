import type { NovelBodyEntity } from 'api/@types/novel';
import type { DefineMethods } from 'aspida';

export type Methods = DefineMethods<{
  get: {
    query: {
      id: string;
    };
    resBody: NovelBodyEntity;
  };
}>;
