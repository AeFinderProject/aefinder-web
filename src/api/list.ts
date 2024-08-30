// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AeFinderHost } from '@/constant';

import { API_REQ_FUNCTION } from './apiType';
export const DEFAULT_METHOD = 'GET';

/**
 * api request configuration directory
 * @example
 *    upload: {
 *      target: '/api/file-management/file-descriptor/upload',
 *      baseConfig: { method: 'POST', },
 *    },
 * or:
 *    upload:'/api/file-management/file-descriptor/upload'
 *
 * @description api configuration default method is from DEFAULT_METHOD
 * @type {UrlObj}  // The type of this object from UrlObj.
 */

export const AuthList = {
  token: {
    target: '/connect/token',
    baseConfig: { method: 'POST' },
  },
  resetPassword: {
    target: `${AeFinderHost}/api/users/reset/password`,
    baseConfig: { method: 'POST' },
  },
};

export const appApiList = {
  getAppList: `${AeFinderHost}/api/apps`,
  createApp: {
    target: `${AeFinderHost}/api/apps`,
    baseConfig: { method: 'POST' },
  },
  modifyApp: {
    target: `${AeFinderHost}/api/apps`,
    baseConfig: { method: 'PUT' },
  },
  getAppDetail: {
    target: `${AeFinderHost}/api/apps`,
    baseConfig: { method: 'GET' },
  },
  getLog: {
    target: `${AeFinderHost}/api/apps/log`,
    baseConfig: { method: 'GET' },
  },
  fetchQraphiql: {
    target: `${AeFinderHost}/api/app/graphql`,
    baseConfig: { method: 'GET' },
  },
};

export const SubscriptionsApiList = {
  getSubscriptions: `${AeFinderHost}/api/apps/subscriptions`,
  addSubscription: {
    target: `${AeFinderHost}/api/apps/subscriptions`,
    baseConfig: { method: 'POST' },
  },
  updateSubscription: {
    target: `${AeFinderHost}/api/apps/subscriptions/manifest`,
    baseConfig: { method: 'PUT' },
  },
  updateCode: {
    target: `${AeFinderHost}/api/apps/subscriptions/code`,
    baseConfig: { method: 'PUT' },
  },
  getDevTemplate: {
    target: `${AeFinderHost}/api/dev-template`,
    baseConfig: { method: 'POST' },
  },
  updateSubscriptionAttachments: {
    target: `${AeFinderHost}/api/apps/subscriptions/attachments`,
    baseConfig: { method: 'PUT' },
  },
  getSubscriptionsAttachments: `${AeFinderHost}/api/apps/subscriptions/attachments`,
};

/**
 * api request extension configuration directory
 * @description object.key // The type of this object key comes from from @type {UrlObj}
 */
export const EXPAND_APIS = {
  auth: AuthList,
  app: appApiList,
  subscription: SubscriptionsApiList,
};

export type EXPAND_REQ_TYPES = {
  [X in keyof typeof EXPAND_APIS]: {
    [K in keyof (typeof EXPAND_APIS)[X]]: API_REQ_FUNCTION;
  };
};
