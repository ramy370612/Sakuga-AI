import { novelUseCase } from 'domain/novel/useCase/novelUseCase';
import { defineController } from './$relay';

export default defineController(() => ({
  get: async ({ query }) => {
    const result = await novelUseCase.searching(query.searchAuthors);
    return {
      status: 200,
      body: result,
    };
  },
}));
