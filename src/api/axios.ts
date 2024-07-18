import axios from 'axios';
import qs from 'qs';

import logger from '@/lib/logger';

import myEvents from './myEvent';

const isDeniedRequest = (error: { message: string }) => {
  try {
    const message: string = error.message;
    if (message?.includes('401')) return true;
  } catch (error) {
    logger(error);
  }
  return false;
};

const axiosInstance = axios.create({
  baseURL: '/',
  timeout: 50000,
  paramsSerializer: (params) => {
    return qs.stringify(params, {
      arrayFormat: 'repeat',
    });
  },
});

axiosInstance.defaults.headers.common['x-csrf-token'] = 'AUTH_TOKEN';

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    if (error?.status === 401 || error?.response?.status === 401) {
      window.location.href = '/login';
      return;
    }
    Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.status === 401) {
      window.location.href = '/login';
      return;
    }
    if (response.status === 200 || response.status === 204) {
      return response.data;
    }
    return Promise.reject(response);
  },
  (error) => {
    if (isDeniedRequest(error)) {
      myEvents.DeniedRequest.emit();
    }
    return Promise.reject(error);
  }
);

const service = axiosInstance;

export default service;
