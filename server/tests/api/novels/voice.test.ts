/* eslint-disable max-lines */
import aspida from '@aspida/axios';
import api from 'api/$api';
import axios from 'axios';
import { novelUseCase } from 'domain/novel/useCase/novelUseCase';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import { API_BASE_PATH, PORT, VOICEVOX_URL } from 'service/envValues';
import { expect, test } from 'vitest';
import { GET } from '../utils';

const baseURL = `http://127.0.0.1:${PORT}${API_BASE_PATH}`;

const apiAxios = axios.create({ withCredentials: true });

const apiClient = api(aspida(apiAxios, { baseURL }));
const mockserver = setupServer(
  http.post(`${VOICEVOX_URL}/audio_query`, () => {
    return HttpResponse.json({
      accent_phrases: [{}],
      speedScale: 0,
      pitchScale: 0,
      intonationScale: 0,
      volumeScale: 0,
      prePhonemeLength: 0,
      postPhonemeLength: 0,
      pauseLength: 0,
      pauseLengthScale: 1,
      outputSamplingRate: 0,
      outputStereo: true,
      kana: 'string',
    });
  }),
  http.post(`${VOICEVOX_URL}/synthesis`, () => {
    return HttpResponse.arrayBuffer(new ArrayBuffer(8), {
      headers: {
        'Content-Type': 'audio/wav',
      },
    });
  }),
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

test(GET(apiClient.novels.voice), async () => {
  const ranking = await novelUseCase.ranking(5);
  if (!ranking) return;

  mockserver.listen();

  //パラグラフを生成する
  await apiClient.novels.body.$get({ query: { id: ranking[1].id } });

  const res = await apiClient.novels.voice.get({
    query: { id: ranking[1].id },
  });
  expect(res.status).toEqual(200);

  const res2 = await apiClient.novels.voice.get({
    query: { id: ranking[1].id },
  });
  expect(res2.status).toEqual(200);

  const nullRes = await apiClient.novels.voice.$get({ query: { id: 'mock' } });
  expect(nullRes).toBeNull;
  mockserver.close();
});
