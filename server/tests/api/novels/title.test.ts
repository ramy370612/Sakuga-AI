import aspida from '@aspida/axios';
import api from 'api/$api';
import axios from 'axios';
import { API_BASE_PATH, PORT } from 'service/envValues';
import { expect, test } from 'vitest';
import { GET } from '../utils';

const baseURL = `http://127.0.0.1:${PORT}${API_BASE_PATH}`;

const apiAxios = axios.create({ withCredentials: true });

const apiClient = api(aspida(apiAxios, { baseURL }));

test(GET(apiClient.novels.title), async () => {
  const res = await apiClient.novels.title.$get({
    query: { name: '宮沢' },
  });

  expect(res[0].title).toEqual('〔雨ニモマケズ〕');
  const nullRes = await apiClient.novels.title.$get({ query: { name: '123' } });
  expect(nullRes).not.toBeNull;
});
