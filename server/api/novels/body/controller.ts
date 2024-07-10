import { mockNovelBody } from 'data/mock/nobelBody';
import { defineController } from './$relay';

export default defineController(() => ({
  get: ({ query: _query }) => ({
    status: 200,
    body: mockNovelBody,
  }),
}));
