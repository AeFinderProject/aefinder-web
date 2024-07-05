import axios from 'axios';
import queryString from 'query-string';

import { handleErrorMessage } from '@/lib/utils';

import { AeFinderAuthHost } from '@/constant';

import { BaseConfig, RequestConfig } from './apiType';
import service from './axios';
import myEvents from './myEvent';
export function spliceUrl(baseUrl: string, extendArg?: string) {
  return extendArg ? baseUrl + '/' + extendArg : baseUrl;
}

export function getRequestConfig(base: BaseConfig, config?: RequestConfig) {
  if (typeof base === 'string') {
    return config;
  } else {
    const { baseConfig } = base || {};
    const { query, method, params, data } = config || {};
    return {
      ...config,
      ...baseConfig,
      query: (baseConfig.query || '') + (query || ''),
      method: method || baseConfig.method,
      params: { ...baseConfig.params, ...params },
      data: { ...baseConfig.data, ...data },
    };
  }
}

type QueryAuthApiBaseConfig = {
  grant_type: string;
  scope: string;
  client_id: string;
};

export type QueryAuthApiExtraRequest = {
  username: string;
  password: string;
};

const queryAuthApiBaseConfig: QueryAuthApiBaseConfig = {
  grant_type: 'password',
  scope: 'AeFinder',
  client_id: 'AeFinder_App',
};

export type JWTData = {
  access_token: string;
  expires_in: number;
  token_type: string;
};

const Day = 1 * 24 * 60 * 60 * 1000;

export type LocalJWTData = {
  expiresTime?: number;
  username?: string;
} & JWTData;

export enum LocalStorageKey {
  TOKEN_TYPE = 'token_type',
  ACCESS_TOKEN = 'aefinder_access_token',
  I18N_LANGUAGE = 'I18N_LANGUAGE',
}

export const getLocalJWT = (key: string) => {
  try {
    const localData = localStorage.getItem(LocalStorageKey.ACCESS_TOKEN);
    if (!localData) return;
    const data = JSON.parse(localData) as { [key: string]: LocalJWTData };
    const cData = data[key];
    if (!cData || !cData?.expiresTime) return;
    if (Date.now() - 0.5 * Day > cData?.expiresTime) return;
    return cData;
  } catch (error) {
    return;
  }
};

export const resetLocalJWT = () => {
  return localStorage.removeItem(LocalStorageKey.ACCESS_TOKEN);
};

export const setLocalJWT = (key: string, data: LocalJWTData) => {
  const localData: LocalJWTData = {
    ...data,
    expiresTime: Date.now() + (data.expires_in - 10) * 1000,
  };
  return localStorage.setItem(
    LocalStorageKey.ACCESS_TOKEN,
    JSON.stringify({ [key]: localData })
  );
};

export const queryAuthApi = async (config: QueryAuthApiExtraRequest) => {
  const data = { ...queryAuthApiBaseConfig, ...config };
  let token_type = '';
  let access_token = '';
  try {
    const res = await axios.post<JWTData>(
      `${AeFinderAuthHost}/connect/token`,
      queryString.stringify(data),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );
    token_type = res.data.token_type;
    access_token = res.data.access_token;

    service.defaults.headers.common[
      'Authorization'
    ] = `${token_type} ${access_token}`;
    myEvents.AuthTokenSuccess.emit();

    if (localStorage) {
      setLocalJWT('LocalJWTData', { ...res.data, username: config.username });
    }
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'queryAuthApi error'));
  }

  return {
    token_type,
    access_token,
  };
};

export const queryAuthToken = async () => {
  const localData = getLocalJWT('LocalJWTData');
  if (localData) {
    service.defaults.headers.common[
      'Authorization'
    ] = `${localData.token_type} ${localData.access_token}`;
    return { auth: 'AuthToken', username: localData.username };
  } else {
    resetLocalJWT();
    return { auth: 'NoAuthToken' };
  }
};

const getAccessTokenConfig = {
  grant_type: 'client_credentials',
  scope: 'AeFinder',
};

export type GetAccessTokenRequest = {
  client_id: string;
  client_secret: string;
};

export const getAccessToken = async (config: GetAccessTokenRequest) => {
  const data = { ...getAccessTokenConfig, ...config };
  let token_type = '';
  let access_token = '';
  try {
    const res = await axios.post<JWTData>(
      `${AeFinderAuthHost}/connect/token`,
      queryString.stringify(data),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );
    token_type = res.data.token_type;
    access_token = res.data.access_token;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'getAccessToken error'));
  }
  return {
    token_type,
    access_token,
  };
};
