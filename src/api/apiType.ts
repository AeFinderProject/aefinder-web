import { AxiosRequestConfig, AxiosResponse } from 'axios';

export enum CommonErrorNameType {
  CANCEL = 'cancel',
}

export enum CancelTokenSourceKey {
  ADD_SUBSCRIPTION = 'addSubscription',
}

export type RequestConfig = {
  query?: string; //this for url parameter； example: test/:id
  cancelTokenSourceKey?: CancelTokenSourceKey;
} & AxiosRequestConfig;

export type IBaseRequest = {
  url: string;
} & RequestConfig;

export type BaseConfig = string | { target: string; baseConfig: RequestConfig };
export type UrlObj = { [key: string]: BaseConfig };
// eslint-disable-next-line
export type API_REQ_FUNCTION = (
  config?: RequestConfig
  // eslint-disable-next-line
) => Promise<any | AxiosResponse<any>>;
