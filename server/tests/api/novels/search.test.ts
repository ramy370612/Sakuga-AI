import aspida from '@aspida/axios';
import api from 'api/$api';
import axios from 'axios';
import { API_BASE_PATH, PORT } from 'service/envValues';
import { expect, test } from 'vitest';
import { GET } from '../utils';

const baseURL = `http://127.0.0.1:${PORT}${API_BASE_PATH}`;

const apiAxios = axios.create({ withCredentials: true });

const apiClient = api(aspida(apiAxios, { baseURL }));

test(GET(apiClient.novels.search), async () => {
  const res = await apiClient.novels.search.$get({
    query: { searchAuthors: '銀河鉄道' },
  });

  expect(res?.[0].title).toEqual('銀河鉄道の夜');
  const nullRes = await apiClient.novels.search.$get({ query: { searchAuthors: 'あ' } });
  expect(nullRes).not.toBeNull;
});
