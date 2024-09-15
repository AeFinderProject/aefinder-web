import { handleErrorMessage } from '@/lib/utils';

import { request } from './index';
import {
  createAppGuest,
  getAppDetailGuest,
  getAppListGuest,
  getAppLogGuest,
  modifyAppGuest,
  resetPasswordGuest,
} from './requestAppGuest';

import {
  CreateAppRequest,
  CreateAppResponse,
  GetAppDetailRequest,
  GetAppDetailResponse,
  GetAppListResponse,
  GetLogRequest,
  GetLogResponse,
  ModifyAppRequest,
} from '@/types/appType';
import { ResetPasswordRequest } from '@/types/loginType';

export const createApp = async (
  params: CreateAppRequest
): Promise<CreateAppResponse> => {
  const isGuest = sessionStorage.getItem('isGuest');
  if (isGuest === 'true') {
    return createAppGuest(params);
  }

  try {
    const res = await request.app.createApp({ data: params });
    return res;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'createApp error'));
  }
};

export const modifyApp = async (
  params: ModifyAppRequest
): Promise<CreateAppResponse> => {
  const isGuest = sessionStorage.getItem('isGuest');
  if (isGuest === 'true') {
    return modifyAppGuest(params);
  }

  try {
    const { appId, ...rest } = params;
    const res = await request.app.modifyApp({ query: appId, data: rest });
    return res;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'modifyApp error'));
  }
};

export const getAppDetail = async (
  params: GetAppDetailRequest
): Promise<GetAppDetailResponse> => {
  const isGuest = sessionStorage.getItem('isGuest');
  if (isGuest === 'true') {
    return getAppDetailGuest(params);
  }
  try {
    const { appId } = params;
    const res = await request.app.getAppDetail({ query: appId });
    return res;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'getAppDetail error'));
  }
};

export const getAppList = async (): Promise<GetAppListResponse> => {
  const isGuest = sessionStorage.getItem('isGuest');
  if (isGuest === 'true') {
    return getAppListGuest();
  }

  try {
    const res = await request.app.getAppList();
    return res;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'getAppList error'));
  }
};

export const getLog = async (
  params: GetLogRequest
): Promise<GetLogResponse[]> => {
  const isGuest = sessionStorage.getItem('isGuest');
  if (isGuest === 'true') {
    return getAppLogGuest(params);
  }

  try {
    const res: GetLogResponse[] = await request.app.getLog({ params });
    return res;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'getLog error'));
  }
};

export const resetPassword = async (
  params: ResetPasswordRequest
): Promise<boolean> => {
  const isGuest = sessionStorage.getItem('isGuest');
  if (isGuest === 'true') {
    return resetPasswordGuest(params);
  }

  try {
    const res: boolean = await request.auth.resetPassword({ data: params });
    return res;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'resetPassword error'));
  }
};
