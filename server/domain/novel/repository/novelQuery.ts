import type { Novel, Prisma } from '@prisma/client';
import type { EntityId } from 'api/@types/brandedId';
import type { NovelBodyEntity, NovelInfo, RankingInfo } from 'api/@types/novel';
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

const getNovelsBytotalAccessCount = async (
  tx: Prisma.TransactionClient,
  limit: number,
): Promise<RankingInfo[]> => {
  const prismaNovels = await tx.novel.findMany({
    orderBy: {
      totalAccessCount: 'desc',
    },
    take: limit,
  });

  if (prismaNovels.length === 0) return [];

  return prismaNovels.map((novel, index) => ({
    ...novel,
    rank: index + 1,
    id: brandedId.novel.entity.parse(novel.id),
  }));
};

const getNovelsByAhthors = async (
  tx: Prisma.TransactionClient,
  SearchParam: string,
): Promise<NovelInfo[]> => {
  const orConditions = [
    { title: { contains: SearchParam } },
    { titleReading: { contains: SearchParam } },
    { sortReading: { contains: SearchParam } },
    { authorSurname: { contains: SearchParam } },
    { authorGivenName: { contains: SearchParam } },
    { authorGivenNameReading: { contains: SearchParam } },
    { authorSurnameReading: { contains: SearchParam } },
    { authorGivenNameSortReading: { contains: SearchParam } },
    { authorSurnameSortReading: { contains: SearchParam } },
    { authorSurnameRomaji: { contains: SearchParam } },
    { authorGivenNameRomaji: { contains: SearchParam } },
  ];

  const prismaNovels = await tx.novel.findMany({
    where: {
      OR: orConditions,
    },
    orderBy: {
      workId: 'asc',
    },
    select: {
      id: true,
      title: true,
      authorSurname: true,
      authorGivenName: true,
    },
  });

  return prismaNovels.map((novel) => ({
    ...novel,
    id: brandedId.novel.entity.parse(novel.id),
  }));
};

const getNovelsByName = async (
  tx: Prisma.TransactionClient,
  name: string,
): Promise<{ title: string }[]> => {
  const orConditions = [
    { authorSurname: { contains: name } },
    { authorGivenName: { contains: name } },
    { authorGivenNameReading: { contains: name } },
    { authorSurnameReading: { contains: name } },
    { authorGivenNameSortReading: { contains: name } },
    { authorSurnameSortReading: { contains: name } },
    { authorSurnameRomaji: { contains: name } },
    { authorGivenNameRomaji: { contains: name } },
  ];

  const prismaNovels = await tx.novel.findMany({
    where: {
      OR: orConditions,
    },
    orderBy: {
      totalAccessCount: 'desc',
    },
    select: {
      title: true,
    },
  });

  return prismaNovels;
};

export const novelQuery = {
  getNovelByWorkId,
  getNovelsByAhthors,
  getNovelsBytotalAccessCount,
  getNovelById,
  getNovelsByName,
};
