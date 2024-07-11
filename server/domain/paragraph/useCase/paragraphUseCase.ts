import type { Prisma } from '@prisma/client';
import type { NovelBodyEntity } from 'api/@types/novel';
import type { ParagraphEntity } from 'api/@types/paragraph';
import { novelQuery } from 'domain/novel/repository/novelQuery';
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

const fetchNovel = async (
  tx: Prisma.TransactionClient,
  workId: number,
): Promise<NovelBodyEntity> => {
  const novel = await novelQuery.getNovelByWorkId(tx, workId);
  if (!novel) {
    throw new Error('novel not found');
  }
  return novel;
};

const createAndSaveParagraphs = async (
  workId: number,
  novel: NovelBodyEntity,
): Promise<ParagraphEntity[]> => {
  const createdParagraphs = await paragraphMethod.create(workId);
  const imageGeneratedParagraphs = await paragraphCommand.generateImage(createdParagraphs, workId);
  imageGeneratedParagraphs.map(async (paragraph) => {
    await transaction('RepeatableRead', async (tx) => {
      await paragraphCommand.save(tx, paragraph, novel.id);
    });
  });
  return imageGeneratedParagraphs;
};

const paragraphUseCase = {
  getOrCreateParagraphs: async (workId: number): Promise<ParagraphEntity[]> => {
    const paragraphs = await transaction('RepeatableRead', async (tx) => {
      const paragraphs = await fetchParagraphs(tx, workId);
      if (paragraphs.length === 0) {
        const novel = await fetchNovel(tx, workId);
        return { novel, paragraphs: [] };
      }
      return { novel: null, paragraphs };
    });

    if (paragraphs.paragraphs.length === 0 && paragraphs.novel) {
      return await createAndSaveParagraphs(workId, paragraphs.novel);
    }

    return paragraphs.paragraphs;
  },
};

export { paragraphUseCase };
