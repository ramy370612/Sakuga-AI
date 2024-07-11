import { mockNovelBody } from 'data/mock/novelBody';
import { defineController } from './$relay';

export default defineController(() => ({
  get: ({ query: _query }) => ({
    status: 200,
    body: mockNovelBody,
  }),
}));
