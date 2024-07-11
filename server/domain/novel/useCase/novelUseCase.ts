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
      const buffer = await fetch(novel.aozoraUrl).then((b) => b.arrayBuffer());
      const html = decode(Buffer.from(buffer), 'Shift_JIS');
      const $ = load(html);

      return $('div.main_text').text();
    }),
  getParagraph: async (workId: number): Promise<NovelBodyEntity | null> =>
    transaction('RepeatableRead', async (tx) => {
      const novel = await novelQuery.getNovelByWorkId(tx, workId);
      if (novel === null) return null;
      return { ...novel, paragraphs: await paragraphUseCase.getOrCreateParagraphs(workId) };
    }),
};
