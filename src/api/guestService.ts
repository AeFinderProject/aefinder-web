import {
  createAppGuest,
  getAppDetailGuest,
  getAppListGuest,
  getAppLogGuest,
  modifyAppGuest,
  resetPasswordGuest,
} from '@/api/requestAppGuest';
import {
  addSubscriptionGuest,
  getSubscriptionsAttachmentsGuest,
  getSubscriptionsGuest,
  updateCodeGuest,
  updateSubscriptionAttachmentsGuest,
  updateSubscriptionGuest,
} from '@/api/requestSubscriptionGuest';

import { IBaseRequest } from './apiType';

const GuestService = function (params: IBaseRequest) {
  const { url, method, query, data } = params;
  console.log('GuestService', params);
  switch (url + '/' + method) {
    case '/api/apps/POST':
      return createAppGuest(data);
    case '/api/apps/PUT':
      return modifyAppGuest({ appId: query, ...data });
    case '/api/apps/GET':
      // get app detail
      if (query) {
        return getAppDetailGuest({ appId: query });
      }
      // get app list
      return getAppListGuest();
    case '/api/apps/log/GET':
      return getAppLogGuest(data);
    case '/api/users/reset/password/POST':
      return resetPasswordGuest(data);

    // api subscriptions
    case '/api/apps/subscriptions/POST':
      return addSubscriptionGuest(data);
    case '/api/apps/subscriptions/GET':
      return getSubscriptionsGuest(data);
    case '/api/apps/subscriptions/manifest/PUT':
      return updateSubscriptionGuest({ ...data, query });
    case '/api/apps/subscriptions/code/PUT':
      return updateCodeGuest(data);
    case '/api/apps/subscriptions/attachments/PUT':
      return updateSubscriptionAttachmentsGuest(data);
    case '/api/apps/subscriptions/attachments/GET':
      return getSubscriptionsAttachmentsGuest(data);
    default:
      console.log('default GuestService');
      break;
  }
};

export default GuestService;
