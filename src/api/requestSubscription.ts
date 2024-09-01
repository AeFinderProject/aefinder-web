import { handleErrorMessage, readAndCompressFile } from '@/lib/utils';

import { getAccessToken } from './apiUtils';
import { request } from './index';
import { SubscriptionsApiList } from './list';

import {
  CreateSubscriptionRequest,
  GetDevTemplateRequest,
  GetSubscriptionAttachmentRequest,
  GetSubscriptionAttachmentResponse,
  GetSubscriptionRequest,
  GetSubscriptionResponse,
  UpdateCodeRequest,
  UpdateSubscriptionAttachmentRequest,
  UpdateSubscriptionRequest,
} from '@/types/subscriptionType';

export const addSubscription = async (
  params: CreateSubscriptionRequest
): Promise<boolean> => {
  let response = false;
  // deploy true or false
  try {
    const { appId, deployKey, Code, Manifest, additionalJSONFileList } = params;
    const Authorization = await getAccessToken({
      client_id: appId,
      client_secret: deployKey,
    });
    const formData = new FormData();
    formData.append('Manifest', Manifest);
    formData.append('Code', Code.originFileObj);
    // set formData additionalJSONFile
    if (additionalJSONFileList) {
      for (const file of additionalJSONFileList) {
        if (file.originFileObj) {
          const compressedFile = await readAndCompressFile(file.originFileObj);
          formData.append('attachmentList', compressedFile);
        }
      }
    }

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
        if (status >= 400) {
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

export const updateCode = async (
  params: UpdateCodeRequest
): Promise<boolean> => {
  // update Code true or false
  let response = false;
  try {
    const {
      appId,
      deployKey,
      version,
      Code,
      additionalJSONFileList,
      AttachmentDeleteFileKeyList,
    } = params;
    const Authorization = await getAccessToken({
      client_id: appId,
      client_secret: deployKey,
    });
    const formData = new FormData();
    if (Code) {
      formData.append('Code', Code.originFileObj);
    }
    // set formData additionalJSONFile  add zip file
    if (additionalJSONFileList?.length) {
      for (const file of additionalJSONFileList) {
        if (file.originFileObj) {
          const compressedFile = await readAndCompressFile(file.originFileObj);
          formData.append('attachmentList', compressedFile);
        }
      }
    }
    if (AttachmentDeleteFileKeyList) {
      formData.append(
        'AttachmentDeleteFileKeyList',
        AttachmentDeleteFileKeyList
      );
    }

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
        if (status >= 400) {
          throw new Error(handleErrorMessage(data?.error, 'updateCode error'));
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

export const getSubscriptions = async (
  params: GetSubscriptionRequest
): Promise<GetSubscriptionResponse> => {
  let response = {} as GetSubscriptionResponse;
  try {
    const { appId, deployKey } = params;
    const Authorization = await getAccessToken({
      client_id: appId,
      client_secret: deployKey,
    });

    await fetch(`${SubscriptionsApiList.getSubscriptions}`, {
      method: 'GET',
      headers: {
        Authorization: `${Authorization.token_type} ${Authorization.access_token}`,
      },
    })
      .then((res: Response) => {
        if (res?.status >= 400) {
          throw new Error(handleErrorMessage(res, 'getSubscriptions error'));
        }
        return res?.json();
      })
      .then((data) => {
        response = data;
        return data as GetSubscriptionResponse;
      });
    return response;
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

export const updateSubscriptionAttachments = async (
  params: UpdateSubscriptionAttachmentRequest
): Promise<boolean> => {
  let response = false;
  try {
    const {
      appId,
      deployKey,
      version,
      additionalJSONFileList,
      attachmentDeleteFileKeyList,
    } = params;
    const Authorization = await getAccessToken({
      client_id: appId,
      client_secret: deployKey,
    });
    const formData = new FormData();
    // set formData additionalJSONFile
    if (additionalJSONFileList) {
      additionalJSONFileList.forEach((file) => {
        file?.originFileObj &&
          formData.append('attachmentList', file.originFileObj);
      });
    }
    if (attachmentDeleteFileKeyList) {
      formData.append(
        'attachmentDeleteFileKeyList',
        attachmentDeleteFileKeyList
      );
    }

    let status = 0;
    await fetch(
      `${SubscriptionsApiList.updateSubscriptionAttachments.target}/${version}`,
      {
        method: 'PUT',
        body: formData,
        headers: {
          Authorization: `${Authorization.token_type} ${Authorization.access_token}`,
        },
      }
    )
      .then((res: Response) => {
        response = res?.ok;
        status = res?.status;
        return res?.status === 200 ? res : res?.json();
      })
      .then((data) => {
        // tip data error when status is 400 403 500
        if (status >= 400) {
          throw new Error(
            handleErrorMessage(
              data?.error,
              'updateSubscriptionAttachments error'
            )
          );
        } else {
          return response;
        }
      });
    return true;
  } catch (error) {
    console.log('error', error);
    return response;
  }
};

export const getSubscriptionsAttachments = async (
  params: GetSubscriptionAttachmentRequest
): Promise<GetSubscriptionAttachmentResponse> => {
  let response = {} as GetSubscriptionAttachmentResponse;
  try {
    const { appId, deployKey, version } = params;
    const Authorization = await getAccessToken({
      client_id: appId,
      client_secret: deployKey,
    });

    await fetch(
      `${SubscriptionsApiList.getSubscriptionsAttachments}/${version}`,
      {
        method: 'GET',
        headers: {
          Authorization: `${Authorization.token_type} ${Authorization.access_token}`,
        },
      }
    )
      .then((res: Response) => {
        if (res?.status >= 400) {
          throw new Error(
            handleErrorMessage(res, 'getSubscriptionsAttachments error')
          );
        }
        return res?.json();
      })
      .then((data) => {
        response = data;
        return data as GetSubscriptionAttachmentResponse;
      });
    return response;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'getSubscription error'));
  }
};
