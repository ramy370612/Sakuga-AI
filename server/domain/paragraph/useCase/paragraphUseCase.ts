import type { EntityId } from 'api/@types/brandedId';
import type { ParagraphEntity } from 'api/@types/paragraph';
import { novelQuery } from 'domain/novel/repository/novelQuery';
import { transaction } from 'service/prismaClient';
import { paragraphMethod } from '../model/paragraphMethod';
import { paragraphCommand } from '../repository/paragraphCommand';
import { paragraphQuery } from '../repository/paragraphQuery';

const paragraphUseCase = {
  getOrCreateParagraphs: async (novelId: EntityId['novel']): Promise<ParagraphEntity[]> => {
    return transaction('RepeatableRead', async (tx) => {
      const paragraphs = await paragraphQuery.listByNovelId(tx, novelId);
      if (paragraphs.length === 0) {
        const novel = await novelQuery.getNovelById(tx, novelId);
        if (!novel) {
          throw new Error('novel not found');
        }

        const paragraphs = await paragraphMethod.create(novel.workId);
        const generatedParagraphs = await paragraphCommand.generateImage(
          paragraphs,
          novel.workId,
        );

        for (const paragraph of generatedParagraphs) {
          await paragraphCommand.save(tx, paragraph, novel.id);
        }
        return generatedParagraphs;
      }
      return paragraphs;
    });
  },
};

export { paragraphUseCase };
