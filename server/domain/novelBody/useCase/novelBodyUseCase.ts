import type { NovelBodyEntity } from 'api/@types/novel';
import { novelQuery } from 'domain/novel/repository/novelQuery';
import { paragraphUseCase } from 'domain/paragraph/useCase/paragraphUseCase';
import { transaction } from 'service/prismaClient';

export const novelBodyUseCase = {
  getParagraph: async (workId: number): Promise<NovelBodyEntity | null> =>
    transaction('RepeatableRead', async (tx) => {
      const novel = await novelQuery.getNovelByWorkId(tx, workId);
      if (novel === null) return null;
      return { ...novel, paragraphs: await paragraphUseCase.getOrCreateParagraphs(novel) };
    }),
};
