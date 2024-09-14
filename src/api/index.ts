import { IBaseRequest } from './apiType';
import { spliceUrl } from './apiUtils';
import axiosService from './axiosService';
import { DEFAULT_METHOD, EXPAND_APIS, EXPAND_REQ_TYPES } from './list';
import myServer from './myServer';

function baseRequest({
  url,
  method = DEFAULT_METHOD,
  query = '',
  ...c
}: IBaseRequest) {
  return axiosService({
    ...c,
    url: spliceUrl(url, query),
    method,
  });
}

Object.entries(EXPAND_APIS).forEach(([key, value]) => {
  myServer.parseRouter(key, value);
});

const request: EXPAND_REQ_TYPES = { ...myServer.base, ...myServer };

export { baseRequest, request };
