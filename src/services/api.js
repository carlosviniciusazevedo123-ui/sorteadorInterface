import axios from 'axios';

import { limparSessao, obterToken } from './session';

export const api = axios.create({
  baseURL: import.meta.env?.VITE_API_URL || '/api',
});

api.interceptors.request.use((config) => {
  const token = obterToken();

  const rotaPublica = /^\/(sessions|users|evaluations)(\/|$)/.test(
    config.url || ''
  );
  if (token && !rotaPublica) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const token = obterToken();
    if (
      error.response?.status === 401 &&
      token &&
      error.config?.headers?.Authorization === `Bearer ${token}`
    ) {
      limparSessao();
    }
    return Promise.reject(error);
  }
);
