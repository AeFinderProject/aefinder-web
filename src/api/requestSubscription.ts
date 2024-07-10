import { handleErrorMessage } from '@/lib/utils';

import { getAccessToken } from './apiUtils';
import { request } from './index';
import { SubscriptionsApiList } from './list';

import {
  CreateSubscriptionRequest,
  GetDevTemplateRequest,
  GetSubscriptionResponse,
  UpdateCode,
  UpdateSubscriptionRequest,
} from '@/types/subscriptionType';

export const addSubscription = async (
  params: CreateSubscriptionRequest
): Promise<boolean> => {
  let response = false;
  // deploy true or false
  try {
    const { appId, deployKey, Code, Manifest } = params;
    const Authorization = await getAccessToken({
      client_id: appId,
      client_secret: deployKey,
    });
    const formData = new FormData();
    formData.append('Manifest', Manifest);
    formData.append('Code', Code.originFileObj);

    let status = 0;
    await fetch(`${SubscriptionsApiList.addSubscription.target}`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `${Authorization.token_type} ${Authorization.access_token}`,
      },
    })
      .then((res: Response) => {
        console.log('res', res);
        response = res?.ok;
        status = res?.status;
        return res?.status === 200 ? res : res?.json();
      })
      .then((data) => {
        // tip data error when status is 400 500
        if (status === 400 || status === 500) {
          throw new Error(
            handleErrorMessage(data?.error, 'addSubscription error')
          );
        } else {
          return response;
        }
      });
    return response;
  } catch (error) {
    console.log('error', error);
    return response;
  }
};

export const updateSubscription = async (
  params: UpdateSubscriptionRequest
): Promise<boolean> => {
  try {
    const { appId, deployKey, version, Manifest } = params;
    const Authorization = await getAccessToken({
      client_id: appId,
      client_secret: deployKey,
    });
    const formData = new FormData();
    formData.append('Manifest', Manifest);
    await request.subscription.updateSubscription({
      query: version,
      data: JSON.parse(Manifest),
      headers: {
        Authorization: `${Authorization.token_type} ${Authorization.access_token}`,
      },
    });
    // no content -> default true
    return true;
  } catch (error) {
    if (error === 'No Content') {
      return true;
    } else {
      throw new Error(handleErrorMessage(error, 'updateSubscription error'));
    }
  }
};

export const updateCode = async (params: UpdateCode): Promise<boolean> => {
  // update Code true or false
  let response = false;
  try {
    const { appId, deployKey, version, Code } = params;
    const Authorization = await getAccessToken({
      client_id: appId,
      client_secret: deployKey,
    });
    const formData = new FormData();
    formData.append('Code', Code.originFileObj);

    let status = 0;
    await fetch(`${SubscriptionsApiList.updateCode.target}/${version}`, {
      method: 'PUT',
      body: formData,
      headers: {
        Authorization: `${Authorization.token_type} ${Authorization.access_token}`,
      },
    })
      .then((res: Response) => {
        response = res?.ok;
        status = res?.status;
        return res?.status === 200 ? res : res?.json();
      })
      .then((data) => {
        // tip data error when status is 400 403 500
        if (status !== 200) {
          throw new Error(
            handleErrorMessage(data?.error, 'addSubscription error')
          );
        } else {
          return response;
        }
      });
    return response;
  } catch (error) {
    console.log('error', error);
    return response;
  }
};

export const getSubscriptions = async (): Promise<GetSubscriptionResponse> => {
  try {
    const res = await request.subscription.getSubscriptions();
    return res;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'getSubscription error'));
  }
};

export const getDevTemplate = async (
  params: GetDevTemplateRequest
): Promise<Blob> => {
  try {
    const res = await request.subscription.getDevTemplate({
      data: params,
      responseType: 'blob',
      headers: {
        'Content-Type': 'application/json; application/octet-stream',
      },
    });
    return res;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'getSubscription error'));
  }
};
