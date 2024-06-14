import { handleErrorMessage } from '@/lib/utils';

import { request } from './index';

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

export const createApp = async (
  params: CreateAppRequest
): Promise<CreateAppResponse> => {
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
  try {
    const { appId } = params;
    const res = await request.app.getAppDetail({ query: appId });
    return res;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'getAppDetail error'));
  }
};

export const getAppList = async (): Promise<GetAppListResponse> => {
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
  try {
    const res: GetLogResponse[] = await request.app.getLog({ params });
    console.log(res);
    return res;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'getLog error'));
  }
};
