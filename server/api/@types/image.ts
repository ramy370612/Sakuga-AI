import type { EntityId } from './brandedId';

export type ImageEntity = {
  id: EntityId['image'];
  url: string;
  createdTime: number;
  bookId: EntityId['novel'];
};
