import { type Novel } from '@prisma/client';
import type { NovelBodyEntity } from 'api/@types/novel';
import { load } from 'cheerio';
import { paragraphUseCase } from 'domain/paragraph/useCase/paragraphUseCase';
import { decode } from 'iconv-lite';
import { transaction } from 'service/prismaClient';
import { novelQuery } from '../repository/novelQuery';

export const novelUseCase = {
  gettext: async (workId: number): Promise<string | null> =>
    transaction('RepeatableRead', async (tx) => {
      const novel = await novelQuery.getNovelByWorkId(tx, workId);
      if (novel === null) return null;
      const response = await fetch(novel.aozoraUrl);
      const buffer = await response.arrayBuffer();
      const html = decode(Buffer.from(buffer), 'Shift_JIS');
      const $ = load(html);

      return $('div.main_text').text().trim();
    }),
  ranking: async (limit: number): Promise<Array<Novel & { rank: number }> | null> =>
    transaction('RepeatableRead', async (tx) => {
      const rankings = await novelQuery.getNovelsBytotalAccessCount(tx, limit);
      if (!rankings || rankings.length === 0) return null;

      return rankings;
    }),
  getParagraph: async (workId: number): Promise<NovelBodyEntity | null> =>
    transaction('RepeatableRead', async (tx) => {
      const novel = await novelQuery.getNovelByWorkId(tx, workId);
      if (novel === null) return null;
      return { ...novel, paragraphs: await paragraphUseCase.getOrCreateParagraphs(workId) };
    }),
};
