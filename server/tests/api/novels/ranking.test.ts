import aspida from '@aspida/axios';
import api from 'api/$api';
import assert from 'assert';
import axios from 'axios';
import { API_BASE_PATH, PORT } from 'service/envValues';
import { expect, test } from 'vitest';
import { GET } from '../utils';

const baseURL = `http://127.0.0.1:${PORT}${API_BASE_PATH}`;

const apiAxios = axios.create({ withCredentials: true });

const apiClient = api(aspida(apiAxios, { baseURL }));

test(GET(apiClient.novels.ranking), async () => {
  const res = await apiClient.novels.ranking.$get({ query: { limit: 54 } });
  assert(res !== null);
  expect(res[0].title).toEqual('こころ');
  const nullRes = await apiClient.novels.ranking.$get({ query: { limit: 0 } });
  expect(nullRes).toEqual([]);
});
