import { prismaClient } from 'service/prismaClient';

import type { AozoraWork } from 'api/@types/novel';
import { ulid } from 'ulid';
import aozoraBookList from '../data/aozoraBookList.json';

const bookDataList = aozoraBookList as AozoraWork[];

async function main(): Promise<void> {
  const count = await prismaClient.novel.count();
  if (count > 0) return;

  const isTestEnv = process.env.NODE_ENV === 'test';
  const booksToProcess = isTestEnv ? bookDataList.slice(0, 100) : bookDataList;

  for (const bookData of booksToProcess) {
    await prismaClient.novel.create({
      data: {
        id: ulid(),
        workId: bookData['作品ID'],
        title: bookData['作品名'],
        titleReading: bookData['作品名読み'],
        sortReading: bookData['ソート用読み'],
        publicationDate: bookData['公開日'],
        lastUpdateDate: bookData['最終更新日'],
        cardUrl: bookData['図書カードURL'],
        authorSurname: bookData['姓'],
        authorGivenName: bookData['名'],
        authorSurnameReading: bookData['姓読み'],
        authorGivenNameReading: bookData['名読み'],
        authorSurnameSortReading: bookData['姓読みソート用'],
        authorGivenNameSortReading: bookData['名読みソート用'],
        authorSurnameRomaji: bookData['姓ローマ字'],
        authorGivenNameRomaji: bookData['名ローマ字'],
        characterCount: bookData['文字数'],
        openingSentence: bookData['書き出し'],
        totalAccessCount: bookData['累計アクセス数'],
        htmlFileUrl: bookData['XHTML/HTMLファイルURL'] || '',
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });
