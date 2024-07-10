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

export { getNovelUrlByWorkId, getNovelsBytotalAccessCount };
