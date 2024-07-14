import type { NovelInfo, RankingInfo } from 'api/@types/novel';
import { load } from 'cheerio';
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
      $('rt').remove();
      $('rp').remove();

      return $('div.main_text').text().trim();
    }),

  ranking: async (limit: number): Promise<RankingInfo[]> =>
    transaction('RepeatableRead', async (tx) => {
      const rankings = await novelQuery.getNovelsBytotalAccessCount(tx, limit);

      return rankings;
    }),

  searching: async (search: string): Promise<NovelInfo[]> =>
    transaction('RepeatableRead', async (tx) => {
      const searchResult = await novelQuery.getNovelsByAhthors(tx, search);

      return searchResult;
    }),

  gettitle: async (name: string): Promise<{ title: string }[]> =>
    transaction('RepeatableRead', async (tx) => {
      const titles = await novelQuery.getNovelsByName(tx, name);

      return titles;
    }),
};
