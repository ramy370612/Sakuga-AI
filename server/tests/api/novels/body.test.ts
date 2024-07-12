import aspida from '@aspida/axios';
import api from 'api/$api';
import axios from 'axios';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { API_BASE_PATH, PORT } from 'service/envValues';
import { expect, test } from 'vitest';
import { GET } from '../utils';

const baseURL = `http://127.0.0.1:${PORT}${API_BASE_PATH}`;

const apiAxios = axios.create({ withCredentials: true });

const apiClient = api(aspida(apiAxios, { baseURL }));

const mockserver = setupServer(
  http.post('https://api.openai.com/v1/chat/completions', () => {
    return HttpResponse.json({
      id: 'chatcmpl-123',
      object: 'chat.completion',
      created: 1234567890,
      model: 'gpt-4-xx',
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: 'This is a mock response',
          },
          finish_reason: 'stop',
        },
      ],
      usage: {
        prompt_tokens: 10,
        completion_tokens: 10,
        total_tokens: 20,
      },
    });
  }),
  http.post('https://api.openai.com/v1/images/generations', () => {
    return HttpResponse.json({
      created: 1589478378,
      data: [
        {
          url: 'https://picsum.photos/1792/1024',
        },
      ],
    });
  }),
);

test(GET(apiClient.novels.body.mock), async () => {
  const res = await apiClient.novels.body.mock.get({ query: { workId: 45630 } });
  expect(res.status).toEqual(200);
});

test(GET(apiClient.novels.body), async () => {
  mockserver.listen();
  const res = await apiClient.novels.body.get({ query: { workId: 45630 } });
  expect(res.status).toEqual(200);

  const res2 = await apiClient.novels.body.$get({ query: { workId: 45630 } });
  expect(res2?.workId).toEqual(45630);

  const nullRes = await apiClient.novels.body.$get({ query: { workId: 99999999 } });
  expect(nullRes).toBeNull();
  mockserver.close();
});
