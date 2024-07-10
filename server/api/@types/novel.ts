import type { EntityId } from './brandedId';

export type NovelEntity = {
  id: EntityId['novel'];
  text: string;
};
