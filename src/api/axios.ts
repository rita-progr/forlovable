import axios from 'axios';
import { AUTH_LOCAL_STORAGE_KEY } from '@/auth/_helpers';

const API_URL = import.meta.env.VITE_APP_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем перехватчик для установки токена
api.interceptors.request.use(
  (config) => {
    const auth = localStorage.getItem(AUTH_LOCAL_STORAGE_KEY);
    if (auth) {
      const { access_token } = JSON.parse(auth);
      config.headers.Authorization = `Bearer ${access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Добавляем перехватчик для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
); 