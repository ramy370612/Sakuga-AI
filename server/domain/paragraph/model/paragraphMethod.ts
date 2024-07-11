import type { ParagraphEntity } from 'api/@types/paragraph';
import { novelUseCase } from 'domain/novel/useCase/novelUseCase';

export const paragraphMethod = {
  create: async (workId: number): Promise<ParagraphEntity[]> => {
    const paragraphs: ParagraphEntity[] = [];

    const novelText = await novelUseCase.gettext(workId);
    if (!novelText) {
      throw new Error('novel text not found');
    }
    //TODO: ここの分割ロジック
    const separateParagraphs = novelText.split('　');
    separateParagraphs.map((paragraph, index) => {
      paragraphs.push({
        index,
        paragraph,
        image: undefined,
      });
    });

    return paragraphs;
  },
};
