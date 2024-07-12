import type { Novel, Prisma } from '@prisma/client';
import type { NovelInfo } from 'api/@types/novel';

const getNovelUrlByWorkId = async (
  tx: Prisma.TransactionClient,
  workId: number,
): Promise<string | null> => {
  const prismaNovel = await tx.novel.findFirst({
    where: { workId },
  });
  if (prismaNovel === null) return null;

  return prismaNovel.htmlFileUrl;
};

const getNovelsBytotalAccessCount = async (
  tx: Prisma.TransactionClient,
  limit: number,
): Promise<Array<Novel & { rank: number }>> => {
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
      title: true,
      authorSurname: true,
      authorGivenName: true,
    },
  });

  return prismaNovels;
};

export { getNovelUrlByWorkId, getNovelsByAhthors, getNovelsBytotalAccessCount };
