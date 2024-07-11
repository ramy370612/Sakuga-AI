import type { Novel, Paragraph, Prisma } from '@prisma/client';
import type { EntityId } from 'api/@types/brandedId';
import type { ParagraphEntity } from 'api/@types/paragraph';

const toEntity = async (
  prismaParagraph: Paragraph & { Novel: Novel },
): Promise<ParagraphEntity> => ({
  index: prismaParagraph.index,
  paragraph: prismaParagraph.paragraph,
  image:
    prismaParagraph.imageURL === null
      ? undefined
      : { url: prismaParagraph.imageURL, s3Key: prismaParagraph.imageURL },
});

const listByNovelId = async (
  tx: Prisma.TransactionClient,
  novelId: EntityId['novel'],
): Promise<ParagraphEntity[]> => {
  const prismaParagraphs = await tx.paragraph.findMany({
    where: { novelId },
    orderBy: { index: 'asc' },
    include: { Novel: true },
  });
  return Promise.all(prismaParagraphs.map(toEntity));
};

const listByNovelWorkId = async (
  tx: Prisma.TransactionClient,
  workId: number,
): Promise<ParagraphEntity[]> => {
  const prismaParagraphs = await tx.paragraph.findMany({
    where: { Novel: { workId } },
    orderBy: { index: 'asc' },
    include: { Novel: true },
  });
  return Promise.all(prismaParagraphs.map(toEntity));
};

export const paragraphQuery = {
  listByNovelId,
  listByNovelWorkId,
};
