import type { Novel, Prisma } from '@prisma/client';

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
  Authors: string,
): Promise<Array<{
  title: string;
  authorSurname: string;
  authorGivenName: string | null;
}> | null> => {
  const orConditions = [
    { title: { contains: Authors } },
    { titleReading: { contains: Authors } },
    { sortReading: { contains: Authors } },
    { authorSurname: { contains: Authors } },
    { authorGivenName: { contains: Authors } },
    { authorGivenNameReading: { contains: Authors } },
    { authorSurnameReading: { contains: Authors } },
    { authorGivenNameSortReading: { contains: Authors } },
    { authorSurnameSortReading: { contains: Authors } },
    { authorSurnameRomaji: { contains: Authors } },
    { authorGivenNameRomaji: { contains: Authors } },
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
