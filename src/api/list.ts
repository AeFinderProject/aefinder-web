// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AeFinderAuthHost, AeFinderHost } from '@/constant';

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
    target: `${AeFinderAuthHost}/connect/token`,
    baseConfig: { method: 'POST' },
  },
  resetPassword: {
    target: `${AeFinderHost}/api/users/reset/password`,
    baseConfig: { method: 'POST' },
  },
  bindWallet: {
    target: `${AeFinderHost}/api/users/bind/wallet`,
    baseConfig: { method: 'POST' },
  },
  register: {
    target: `${AeFinderHost}/api/users/register`,
    baseConfig: { method: 'POST' },
  },
  resend: {
    target: `${AeFinderHost}/api/users/register/resend`,
    baseConfig: { method: 'POST' },
  },
  emailVerification: {
    target: `${AeFinderHost}/api/users/register/confirm`,
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
  getUsersInfo: {
    target: `${AeFinderHost}/api/users/info`,
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

export const apiKeyList = {
  getSummary: `${AeFinderHost}/api/api-keys/summary`,
  getSnapshots: `${AeFinderHost}/api/api-keys/summary-snapshots`,
  addApiKey: {
    target: `${AeFinderHost}/api/api-keys`,
    baseConfig: { method: 'POST' },
  },
  getApiKeysList: `${AeFinderHost}/api/api-keys`,
  getApiKeyDetail: `${AeFinderHost}/api/api-keys`,
  getApiKeySnapshot: `${AeFinderHost}/api/api-keys`,
  getAeIndexers: `${AeFinderHost}/api/api-keys`,
  getAeIndexerSnapshots: `${AeFinderHost}/api/api-keys`,
  getAPI: `${AeFinderHost}/api/api-keys`,
  getAPISnapshots: `${AeFinderHost}/api/api-keys`,
  renameApiKey: {
    target: `${AeFinderHost}/api/api-keys`,
    baseConfig: { method: 'PUT' },
  },
  regenerateApiKey: {
    target: `${AeFinderHost}/api/api-keys`,
    baseConfig: { method: 'POST' },
  },
  deleteApiKey: {
    target: `${AeFinderHost}/api/api-keys`,
    baseConfig: { method: 'DELETE' },
  },
  setSpendingLimit: {
    target: `${AeFinderHost}/api/api-keys`,
    baseConfig: { method: 'PUT' },
  },
  addAuthorisedAeIndexer: {
    target: `${AeFinderHost}/api/api-keys`,
    baseConfig: { method: 'PUT' },
  },
  deleteAuthorisedAeIndexer: {
    target: `${AeFinderHost}/api/api-keys`,
    baseConfig: { method: 'DELETE' },
  },
  addAuthorisedDomain: {
    target: `${AeFinderHost}/api/api-keys`,
    baseConfig: { method: 'PUT' },
  },
  deleteAuthorisedDomain: {
    target: `${AeFinderHost}/api/api-keys`,
    baseConfig: { method: 'DELETE' },
  },
  setAuthorisedApis: {
    target: `${AeFinderHost}/api/api-keys`,
    baseConfig: { method: 'PUT' },
  },
  getAeIndexerMyList: `${AeFinderHost}/api/apps/search`,
};

export const marketList = {
  getOrgUserAll: `${AeFinderHost}/api/organizations/user/all`,
  getOrgBalance: `${AeFinderHost}/api/organizations/balance`,
  getResourcesLevel: `${AeFinderHost}/api/market/pod-resources/level`,
  getResourcesFull: `${AeFinderHost}/api/market/pod-resource/full`,
  getApiQueryCountFree: `${AeFinderHost}/api/market/api-query-count/free`,
  getApiQueryCountMonthly: `${AeFinderHost}/api/market/api-query-count/monthly`,
  getRegular: `${AeFinderHost}/api/market/api-query-count/regular`,
  resourceBillPlan: {
    target: `${AeFinderHost}/api/market/calculate/resource-bill-plan`,
    baseConfig: { method: 'POST' },
  },
  createOrder: {
    target: `${AeFinderHost}/api/market/create/order`,
    baseConfig: { method: 'POST' },
  },
  getFullPodUsage: `${AeFinderHost}/api/apps/resources/full-pod/usage`,
  bindOrganization: {
    target: `${AeFinderHost}/api/users/bind/organization`,
    baseConfig: { method: 'POST' },
  },
  emailSendCode: {
    target: `${AeFinderHost}/api/email/send-code`,
    baseConfig: { method: 'POST' },
  },
  setNotification: {
    target: `${AeFinderHost}/api/email/set-notification`,
    baseConfig: { method: 'POST' },
  },
  appDeployObliterate: {
    target: `${AeFinderHost}/api/app-deploy/obliterate`,
    baseConfig: { method: 'POST' },
  },
  destroyPending: {
    target: `${AeFinderHost}/api/app-deploy/destroy-pending`,
    baseConfig: { method: 'POST' },
  },
  getTransactionHistory: `${AeFinderHost}/api/market/transaction-history`,
  getInvoices: `${AeFinderHost}/api/market/invoices`,
};

/**
 * api request extension configuration directory
 * @description object.key // The type of this object key comes from from @type {UrlObj}
 */
export const EXPAND_APIS = {
  auth: AuthList,
  app: appApiList,
  subscription: SubscriptionsApiList,
  apikey: apiKeyList,
  market: marketList,
};

export type EXPAND_REQ_TYPES = {
  [X in keyof typeof EXPAND_APIS]: {
    [K in keyof (typeof EXPAND_APIS)[X]]: API_REQ_FUNCTION;
  };
};
