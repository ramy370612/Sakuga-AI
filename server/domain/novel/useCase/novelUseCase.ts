import { type Novel } from '@prisma/client';
import { load } from 'cheerio';
import { decode } from 'iconv-lite';
import { transaction } from 'service/prismaClient';
import { getNovelUrlByWorkId, getNovelsBytotalAccessCount } from '../repository/novelQuery';

export const novelUseCase = {
  gettext: async (workId: number): Promise<string | null> =>
    transaction('RepeatableRead', async (tx) => {
      const novelURL = await getNovelUrlByWorkId(tx, workId);
      if (novelURL === null) return null;
      const response = await fetch(novelURL);
      const buffer = await response.arrayBuffer();
      const html = decode(Buffer.from(buffer), 'Shift_JIS');
      const $ = load(html);

      return $('div.main_text').text().trim();
    }),
  ranking: async (limit: number): Promise<Array<Novel & { rank: number }> | null> =>
    transaction('RepeatableRead', async (tx) => {
      const rankings = await getNovelsBytotalAccessCount(tx, limit);
      if (!rankings || rankings.length === 0) return null;

      return rankings;
    }),
};
