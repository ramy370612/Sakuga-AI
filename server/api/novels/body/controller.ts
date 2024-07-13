import { novelBodyUseCase } from 'domain/novelBody/useCase/novelBodyUseCase';
import { brandedId } from 'service/brandedId';
import { defineController } from './$relay';

export default defineController(() => ({
  get: {
    handler: async ({ query }) => {
      const novelId = brandedId.novel.entity.parse(query.id);
      return {
        status: 200,
        body: await novelBodyUseCase.getParagraph(novelId),
      };
    },
  },
}));
