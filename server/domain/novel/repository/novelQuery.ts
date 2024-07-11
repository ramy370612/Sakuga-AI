import type { Novel, Prisma } from '@prisma/client';
import type { EntityId } from 'api/@types/brandedId';
import type { NovelBodyEntity } from 'api/@types/novel';
import { paragraphQuery } from 'domain/paragraph/repository/paragraphQuery';
import { brandedId } from 'service/brandedId';

const toEntity = async (
  tx: Prisma.TransactionClient,
  prismaNovel: Novel,
): Promise<NovelBodyEntity> => ({
  id: brandedId.novel.entity.parse(prismaNovel.id),
  workId: prismaNovel.workId,
  title: prismaNovel.title,
  authorName: `${prismaNovel.authorSurname} ${prismaNovel.authorGivenName}`,
  paragraphs: await paragraphQuery.listByNovelId(tx, brandedId.novel.entity.parse(prismaNovel.id)),
  aozoraUrl: prismaNovel.htmlFileUrl,
});

const getNovelByWorkId = async (
  tx: Prisma.TransactionClient,
  workId: number,
): Promise<NovelBodyEntity | null> => {
  const prismaNovel = await tx.novel.findFirst({
    where: { workId },
  });
  if (prismaNovel === null) return null;

  return toEntity(tx, prismaNovel);
};

const getNovelById = async (
  tx: Prisma.TransactionClient,
  id: EntityId['novel'],
): Promise<NovelBodyEntity | null> => {
  const prismaNovel = await tx.novel.findFirst({
    where: { id },
  });
  if (prismaNovel === null) return null;
  return toEntity(tx, prismaNovel);
};

export const novelQuery = {
  getNovelByWorkId,
  getNovelById,
};
