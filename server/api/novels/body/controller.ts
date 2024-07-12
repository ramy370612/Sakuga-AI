import { novelBodyUseCase } from 'domain/novelBody/useCase/novelBodyUseCase';
import { defineController } from './$relay';

export default defineController(() => ({
  get: async ({ query }) => ({
    status: 200,
    body: await novelBodyUseCase.getParagraph(query.workId),
  }),
}));
