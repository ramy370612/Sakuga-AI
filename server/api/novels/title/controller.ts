import { novelUseCase } from 'domain/novel/useCase/novelUseCase';
import { defineController } from './$relay';

export default defineController(() => ({
  get: async ({ query }) => ({
    status: 200,
    body: await novelUseCase.gettitle(query.name),
  }),
}));
