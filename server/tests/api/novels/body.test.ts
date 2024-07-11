import aspida from '@aspida/axios';
import api from 'api/$api';
import type { EntityId } from 'api/@types/brandedId';
import axios from 'axios';
import { API_BASE_PATH, PORT } from 'service/envValues';
import { expect, test } from 'vitest';
import { GET } from '../utils';

const baseURL = `http://127.0.0.1:${PORT}${API_BASE_PATH}`;

const apiAxios = axios.create({ withCredentials: true });

const apiClient = api(aspida(apiAxios, { baseURL }));

test(GET(apiClient.novels.body), async () => {
  const res = await apiClient.novels.body.$get({ query: { id: '1567' as EntityId['novel'] } });
  expect(res).not.toBeNull();
});
