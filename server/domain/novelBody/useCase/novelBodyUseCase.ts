import type { EntityId } from 'api/@types/brandedId';
import type { NovelBodyEntity } from 'api/@types/novel';
import { novelQuery } from 'domain/novel/repository/novelQuery';
import { paragraphUseCase } from 'domain/paragraph/useCase/paragraphUseCase';
import { transaction } from 'service/prismaClient';

export const novelBodyUseCase = {
  getParagraph: async (id: EntityId['novel']): Promise<NovelBodyEntity | null> =>
    transaction('RepeatableRead', async (tx) => {
      const novel = await novelQuery.getNovelById(tx, id);
      if (novel === null) return null;
      return { ...novel, paragraphs: await paragraphUseCase.getOrCreateParagraphs(novel) };
    }),
};
