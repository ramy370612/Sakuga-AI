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

  console.log(prismaNovels);

  return prismaNovels.map((novel, index) => ({
    ...novel,
    rank: index + 1,
  }));
};

const getNovelsByAhthors = async (
  tx: Prisma.TransactionClient,
  search: string | number,
): Promise<Array<{
  workId: number;
  title: string;
  authorSurname: string;
  authorGivenName: string | null;
}> | null> => {
  const searchString = search.toString();
  const searchNumber = Number.parseInt(searchString);

  const orConditions = [];

  if (!isNaN(searchNumber)) {
    orConditions.push({ workId: searchNumber });
  }

  orConditions.push(
    { title: searchString },
    { titleReading: searchString },
    { sortReading: searchString },
    { authorSurname: searchString },
    { authorGivenName: searchString },
    { authorGivenNameReading: searchString },
    { authorSurnameReading: searchString },
    { authorGivenNameSortReading: searchString },
    { authorSurnameSortReading: searchString },
    { authorSurnameRomaji: searchString },
    { authorGivenNameRomaji: searchString },
  );

  const prismaNovels = await tx.novel.findMany({
    where: {
      OR: orConditions,
    },
    orderBy: {
      workId: 'asc',
    },
    select: {
      workId: true,
      title: true,
      authorSurname: true,
      authorGivenName: true,
    },
  });

  const uniqueNovelsMap = new Map<
    number,
    {
      workId: number;
      title: string;
      authorSurname: string;
      authorGivenName: string | null;
    }
  >();

  prismaNovels.forEach((novel) => {
    if (!uniqueNovelsMap.has(novel.workId)) {
      uniqueNovelsMap.set(novel.workId, novel);
    }
  });

  const uniqueNovels = Array.from(uniqueNovelsMap.values());

  return uniqueNovels.length > 0 ? uniqueNovels : null;
};

export { getNovelUrlByWorkId, getNovelsByAhthors, getNovelsBytotalAccessCount };
