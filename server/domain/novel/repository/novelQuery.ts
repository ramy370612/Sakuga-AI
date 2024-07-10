import type { Prisma } from '@prisma/client';

const getNovelUrlByWorkId = async (
  tx: Prisma.TransactionClient,
  workId: number,
): Promise<string | null> => {
  const prismaNovel = await tx.book.findFirst({
    where: { workId },
  });
  if (prismaNovel === null) return null;

  return prismaNovel.htmlFileUrl;
};

export { getNovelUrlByWorkId };
