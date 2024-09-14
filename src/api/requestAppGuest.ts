import { handleErrorMessage } from '@/lib/utils';

import db from '@/api/guestDB';
import { GuestLog } from '@/constant/guestLog';

import {
  AppStatusType,
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

export const createAppGuest = async (
  params: CreateAppRequest
): Promise<CreateAppResponse> => {
  const { appName } = params;
  // step 1 check appName exist
  const appId = await db.appTable.get({ appName });
  if (appId) {
    throw new Error('App name already exists');
  }
  const currentAppDetail: CreateAppResponse = {
    appId: appName,
    appName,
    deployKey: 'd950e3a5b301482bbe8dac4edc58f422',
    description: '',
    imageUrl: '',
    sourceCodeUrl: '',
    status: AppStatusType.UnDeployed,
    createTime: Date.now(),
    updateTime: Date.now(),
  };
  // step 2 create app
  await db.appTable.add(currentAppDetail);
  // step 3 create subscription
  await db.deployTable.add({
    appId: appName,
    deployKey: 'd950e3a5b301482bbe8dac4edc58f422',
    status: AppStatusType.UnDeployed,
    currentVersion: '',
    pendingVersion: '',
  });

  return currentAppDetail;
};

export const modifyAppGuest = async (
  params: ModifyAppRequest
): Promise<CreateAppResponse> => {
  const { appId, description, sourceCodeUrl } = params;
  // step 1 check if appId exists
  const existingApp = await db.appTable.get(appId);
  if (!existingApp) {
    throw new Error(`AppId ${appId} does not exist.`);
  }
  // step 2 update app detail
  const updateTime = Date.now();
  await db.appTable.update(appId, {
    description,
    sourceCodeUrl,
    updateTime,
  });
  const res = await db.appTable.get(appId);
  return res as CreateAppResponse;
};

export const getAppDetailGuest = async (
  params: GetAppDetailRequest
): Promise<GetAppDetailResponse> => {
  try {
    const { appId } = params;
    // step 1 get app detail
    const appDetail = await db.appTable.get(appId);
    if (!appDetail) {
      throw new Error('App not found');
    }
    // step 2 get app version
    const appDeployDetail = await db.deployTable.get(appId);
    const res = {
      ...appDetail,
      versions: {
        currentVersion: appDeployDetail?.currentVersion,
        pendingVersion: appDeployDetail?.pendingVersion,
      },
    } as GetAppDetailResponse;
    return res;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'getAppDetail error'));
  }
};

export const getAppListGuest = async (): Promise<GetAppListResponse> => {
  try {
    const items = await db.appTable.toArray();
    return {
      items: items as CreateAppResponse[],
      totalCount: items.length,
    };
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'getAppList error'));
  }
};

export const getAppLogGuest = async (
  params: GetLogRequest
): Promise<GetLogResponse[]> => {
  try {
    const { searchKeyWord, chainId, levels } = params;
    // step 1 check if there is a log list, if not exists, init log list
    let logList = await db.appLogTable.toArray();
    if (!logList.length) {
      await db.appLogTable.bulkAdd(GuestLog);
    }
    logList = await db.appLogTable.toArray();
    // step 2 filter log list
    if (searchKeyWord) {
      logList = logList.filter((item) => {
        return item?.app_log?.message?.includes(searchKeyWord);
      });
    }
    if (chainId) {
      logList = logList.filter((item) => {
        return item?.app_log?.chainId === chainId;
      });
    }

    if (levels.length) {
      logList = logList.filter((item) => {
        return levels.includes(item?.app_log?.level);
      });
    }

    // step 3 timestamp change as now
    if (logList.length) {
      logList.map((item) => {
        const now = new Date();
        item.app_log.time = now.toISOString();
      });
    }

    return logList;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'getLog error'));
  }
};

export const resetPasswordGuest = async (
  params: ResetPasswordRequest
): Promise<boolean> => {
  try {
    console.log(params);
    return false;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'resetPassword error'));
  }
};
