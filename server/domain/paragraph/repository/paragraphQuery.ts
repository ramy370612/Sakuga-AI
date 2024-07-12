import type { Novel, Paragraph, Prisma } from '@prisma/client';
import type { EntityId } from 'api/@types/brandedId';
import type { ParagraphEntity } from 'api/@types/paragraph';
import { s3 } from 'service/s3Client';

const toEntity = async (
  prismaParagraph: Paragraph & { Novel: Novel },
): Promise<ParagraphEntity> => ({
  index: prismaParagraph.index,
  content: prismaParagraph.paragraph,
  image:
    prismaParagraph.imageKey === null
      ? undefined
      : { url: await s3.getSignedUrl(prismaParagraph.imageKey), s3Key: prismaParagraph.imageKey },
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
