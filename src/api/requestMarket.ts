import { handleErrorMessage } from '@/lib/utils';

import { request } from './index';

import {
  AppDeployObliterateRequest,
  BindOrganizationRequest,
  BindOrganizationResponse,
  CreateOrderRequest,
  CreateOrderResponse,
  DestroyPendingRequest,
  EmailSendCodeRequest,
  GetFullPodUsageRequest,
  GetFullPodUsageResponse,
  GetInvoicesResponse,
  GetOrgBalanceResponse,
  GetRegularResponse,
  GetResourcesFullRequest,
  GetResourcesLevelResponse,
  GetTransactionHistoryRequest,
  GetTransactionHistoryResponse,
  GetUserAllResponse,
  ResourceBillPlanRequest,
  ResourceBillPlanResponse,
  ResourcesLevelItem,
  SetNotificationRequest,
} from '@/types/marketType';

export const getOrgUserAll = async (): Promise<GetUserAllResponse[]> => {
  try {
    const res = await request.market.getOrgUserAll();
    return res;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'getOrgUserAll error'));
  }
};

export const getOrgBalance = async (): Promise<GetOrgBalanceResponse> => {
  try {
    const res = await request.market.getOrgBalance();
    return res;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'getOrgBalance error'));
  }
};

export const getResourcesLevel =
  async (): Promise<GetResourcesLevelResponse> => {
    try {
      const res = await request.market.getResourcesLevel();
      return res;
    } catch (error) {
      throw new Error(handleErrorMessage(error, 'getResourcesLevel error'));
    }
  };

export const getResourcesFull = async (
  params: GetResourcesFullRequest
): Promise<ResourcesLevelItem> => {
  try {
    const res = await request.market.getResourcesFull({ params });
    return res;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'getResourcesFull error'));
  }
};

export const getApiQueryCountFree = async (): Promise<number> => {
  try {
    const res = await request.market.getApiQueryCountFree();
    return res;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'getApiQueryCountFree error'));
  }
};

export const getApiQueryCountMonthly = async (): Promise<number> => {
  try {
    const res = await request.market.getApiQueryCountMonthly();
    return res;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'getApiQueryCountMonthly error'));
  }
};

export const getMarketRegular = async (): Promise<GetRegularResponse> => {
  try {
    const res = await request.market.getRegular();
    return res;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'getMarketRegular error'));
  }
};

export const resourceBillPlan = async (
  params: ResourceBillPlanRequest
): Promise<ResourceBillPlanResponse> => {
  try {
    const res = await request.market.resourceBillPlan({ data: params });
    return res;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'resourceBillPlan error'));
  }
};

export const createOrder = async (
  params: CreateOrderRequest
): Promise<CreateOrderResponse> => {
  try {
    const res = await request.market.createOrder({ data: params });
    return res;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'createOrder error'));
  }
};

export const getFullPodUsage = async (
  params: GetFullPodUsageRequest
): Promise<GetFullPodUsageResponse> => {
  try {
    const res = await request.market.getFullPodUsage({
      params,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return res;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'getFullPodUsage error'));
  }
};

export const bindOrganization = async (
  params: BindOrganizationRequest
): Promise<BindOrganizationResponse> => {
  try {
    const res = await request.market.bindOrganization({ data: params });
    return res;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'bindOrganization error'));
  }
};

export const emailSendCode = async (
  params: EmailSendCodeRequest
): Promise<boolean> => {
  try {
    await request.market.emailSendCode({ data: params });
    return true;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'emailSendCode error'));
  }
};

export const setNotification = async (
  params: SetNotificationRequest
): Promise<boolean> => {
  try {
    await request.market.setNotification({ data: params });
    return true;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'setNotification error'));
  }
};

export const appDeployObliterate = async (
  params: AppDeployObliterateRequest
): Promise<boolean> => {
  try {
    await request.market.appDeployObliterate({ data: params });
    return true;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'appDeployObliterate error'));
  }
};

export const destroyPending = async (
  params: DestroyPendingRequest
): Promise<boolean> => {
  try {
    await request.market.destroyPending({ data: params });
    return true;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'destroyPending error'));
  }
};

export const getTransactionHistory = async (
  params: GetTransactionHistoryRequest
): Promise<GetTransactionHistoryResponse> => {
  try {
    const res = await request.market.getTransactionHistory({ params });
    return res;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'getTransactionHistory error'));
  }
};

export const getInvoices = async (): Promise<GetInvoicesResponse> => {
  try {
    const res = await request.market.getInvoices();
    return res;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'getInvoices error'));
  }
};
