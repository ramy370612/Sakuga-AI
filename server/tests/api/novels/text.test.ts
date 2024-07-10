import aspida from '@aspida/axios';
import api from 'api/$api';
import axios from 'axios';
import { API_BASE_PATH, PORT } from 'service/envValues';
import { expect, test } from 'vitest';
import { GET } from '../utils';

const baseURL = `http://127.0.0.1:${PORT}${API_BASE_PATH}`;

const apiAxios = axios.create({ withCredentials: true });

const apiClient = api(aspida(apiAxios, { baseURL }));

test(GET(apiClient.novels.text), async () => {
  const res = await apiClient.novels.text.$get({ query: { workId: 1567 } });
  //書き出しが一致することを確認
  expect(res).toContain('走れメロス');

  const nullRes = await apiClient.novels.text.$get({ query: { workId: 999999999 } });
  //存在しないworkIdの場合、nullが返ることを確認
  expect(nullRes).toBeNull();
});

test(GET(apiClient.novels), async () => {
  const res = await apiClient.novels.$get();
  expect(res).toEqual('');
});
