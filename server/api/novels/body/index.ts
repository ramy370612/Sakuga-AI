import type { EntityId } from 'api/@types/brandedId';
import type { NovelBodyEntity } from 'api/@types/novel';
import type { DefineMethods } from 'aspida';

export type Methods = DefineMethods<{
  get: {
    query: {
      id: EntityId['novel'];
    };
    resBody: NovelBodyEntity;
  };
}>;
