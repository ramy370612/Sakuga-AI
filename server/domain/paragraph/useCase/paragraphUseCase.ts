import type { Prisma } from '@prisma/client';
import type { NovelBodyEntity } from 'api/@types/novel';
import type { ParagraphEntity } from 'api/@types/paragraph';
import { transaction } from 'service/prismaClient';
import { paragraphMethod } from '../model/paragraphMethod';
import { paragraphCommand } from '../repository/paragraphCommand';
import { paragraphQuery } from '../repository/paragraphQuery';

const fetchParagraphs = async (
  tx: Prisma.TransactionClient,
  workId: number,
): Promise<ParagraphEntity[]> => {
  return paragraphQuery.listByNovelWorkId(tx, workId);
};

const createAndSaveParagraphs = async (
  workId: number,
  novel: NovelBodyEntity,
): Promise<ParagraphEntity[]> => {
  const createdParagraphs = await paragraphMethod.create(workId);
  const imageGeneratedParagraphs = await paragraphCommand.generateImage(createdParagraphs, workId);

  for (const paragraph of imageGeneratedParagraphs) {
    await transaction('RepeatableRead', async (tx) => {
      await paragraphCommand.save(tx, paragraph, novel.id);
    });
  }

  return imageGeneratedParagraphs;
};

const paragraphUseCase = {
  getOrCreateParagraphs: async (novel: NovelBodyEntity): Promise<ParagraphEntity[]> => {
    const paragraphs = await transaction('RepeatableRead', async (tx) => {
      const paragraphs = await fetchParagraphs(tx, novel.workId);
      if (paragraphs.length === 0) {
        return await createAndSaveParagraphs(novel.workId, novel);
      }
      return paragraphs;
    });

    return paragraphs;
  },
};

export { paragraphUseCase };
