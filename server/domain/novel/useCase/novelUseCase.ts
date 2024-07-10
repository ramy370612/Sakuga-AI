import { load } from 'cheerio';
import { decode } from 'iconv-lite';
import { transaction } from 'service/prismaClient';
import { getNovelUrlByWorkId } from '../repository/novelQuery';

export const novelUseCase = {
  gettext: async (workId: number): Promise<string | null> =>
    transaction('RepeatableRead', async (tx) => {
      const novelURL = await getNovelUrlByWorkId(tx, workId);
      if (novelURL === null) return null;
      const buffer = await fetch(novelURL).then((b) => b.arrayBuffer());
      const html = decode(Buffer.from(buffer), 'Shift_JIS');
      const $ = load(html);

      return $('body').text();
    }),
};
