import axios, { CancelTokenSource } from 'axios';

import { BaseConfig, RequestConfig, UrlObj } from './apiType';
import { getRequestConfig, spliceUrl } from './apiUtils';
import axiosService from './axiosService';
import guestService from './guestService';
import { DEFAULT_METHOD } from './list';

const myServer = new Function();

const cancelTokenSources: Map<string, CancelTokenSource> = new Map();

/**
 * @method parseRouter
 * @param  {string} name
 * @param  {UrlObj} urlObj
 */
myServer.prototype.parseRouter = function (name: string, urlObj: UrlObj) {
  // eslint-disable-next-line
  const obj: any = (this[name] = {});
  Object.keys(urlObj).forEach((key) => {
    obj[key] = this.send.bind(this, urlObj[key]);
  });
};

/**
 * @method send
 * @param  {BaseConfig} base
 * @param  {object} config
 * @return {Promise<any>}
 */
myServer.prototype.send = function (base: BaseConfig, config: RequestConfig) {
  const {
    method = DEFAULT_METHOD,
    query = '',
    url,
    cancelTokenSourceKey,
    ...axiosConfig
  } = getRequestConfig(base, config) || {};
  const source = axios.CancelToken.source();
  if (cancelTokenSourceKey) {
    if (cancelTokenSources.has(cancelTokenSourceKey)) {
      cancelTokenSources.get(cancelTokenSourceKey)?.cancel();
    }
    cancelTokenSources.set(cancelTokenSourceKey, source);
  }
  // if guest mode, use guest service
  const isGuest = sessionStorage.getItem('isGuest');
  console.log('isGuest', isGuest);
  if (isGuest === 'true' && '/api/dev-template' !== url) {
    console.log('guestService ===>');
    return guestService({
      ...axiosConfig,
      url: typeof base === 'string' ? base : base.target,
      method,
      query,
      cancelToken: source.token,
    });
  }
  return axiosService({
    ...axiosConfig,
    url: url || spliceUrl(typeof base === 'string' ? base : base.target, query),
    method,
    cancelToken: source.token,
  });
};

export default myServer.prototype;
