import aspida from '@aspida/axios';
import api from 'api/$api';
import axios from 'axios';
import { assert } from 'console';
import { API_BASE_PATH, PORT } from 'service/envValues';
import { expect, test } from 'vitest';
import { GET } from '../utils';

const baseURL = `http://127.0.0.1:${PORT}${API_BASE_PATH}`;

const apiAxios = axios.create({ withCredentials: true });

const apiClient = api(aspida(apiAxios, { baseURL }));

test(GET(apiClient.novels.search), async () => {
  const mockNovels = {
    workId: 2,
    title: '三十三の死',
    authorSurname: '素木',
    authorGivenName: 'しづ',
  };
  const res = await apiClient.novels.search.$get({
    query: { searchAuthors: mockNovels.authorSurname },
  });
  assert(res !== null);
  expect(res).toContainEqual(mockNovels);
  const nullRes = await apiClient.novels.search.$get({ query: { searchAuthors: 'あ' } });
  expect(nullRes).toBeNull;
});
