import { handleErrorMessage } from '@/lib/utils';

import { marketList } from '@/api/list';

import { request } from './index';

import {
  AppDeployObliterateRequest,
  BillingItem,
  BindOrganizationRequest,
  BindOrganizationResponse,
  CreateOrderRequest,
  CreateOrderResponse,
  DestroyPendingRequest,
  EmailSendCodeRequest,
  GetAssetsListRequest,
  GetAssetsListResponse,
  GetAssetsRelateRequest,
  GetBillingOverviewResponse,
  GetBillingsDetailRequest,
  GetBillingsListRequest,
  GetBillingsListResponse,
  GetFullPodUsageRequest,
  GetFullPodUsageResponse,
  GetIsCustomAppRequest,
  GetMerchandisesListRequest,
  GetMerchandisesListResponse,
  GetOrdersDetailRequest,
  GetOrdersListRequest,
  GetOrdersListResponse,
  GetOrgBalanceResponse,
  GetTransactionHistoryRequest,
  GetTransactionHistoryResponse,
  GetUserAllResponse,
  NewOrderItemType,
  PayRequest,
  ResourceBillPlanRequest,
  ResourceBillPlanResponse,
  SetNotificationRequest,
  WatchOrdersCostRequest,
} from '@/types/marketType';

export const getUserAll = async (): Promise<GetUserAllResponse[]> => {
  try {
    const res = await request.market.getUserAll();
    return res;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'getUserAll error'));
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

export const getBillingOverview =
  async (): Promise<GetBillingOverviewResponse> => {
    try {
      const res = await request.market.getBillingOverview();
      return res;
    } catch (error) {
      throw new Error(handleErrorMessage(error, 'getBillingOverview error'));
    }
  };

export const getMerchandisesList = async (
  params: GetMerchandisesListRequest
): Promise<GetMerchandisesListResponse> => {
  try {
    const res = await request.market.getMerchandisesList({ params });
    return res;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'getMerchandisesList error'));
  }
};

export const getOrdersList = async (
  params: GetOrdersListRequest
): Promise<GetOrdersListResponse> => {
  try {
    const res = await request.market.getOrdersList({ params });
    return res;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'getOrdersList error'));
  }
};

export const getOrdersDetail = async (
  params: GetOrdersDetailRequest
): Promise<NewOrderItemType> => {
  try {
    const res = await request.market.getOrdersDetail({ query: params?.id });
    return res;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'getOrdersDetail error'));
  }
};

export const watchOrdersCost = async (
  params: WatchOrdersCostRequest
): Promise<NewOrderItemType> => {
  try {
    const res = await request.market.watchOrdersCost({ data: params });
    return res;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'watchOrdersCost error'));
  }
};

export const order = async (
  params: WatchOrdersCostRequest
): Promise<NewOrderItemType> => {
  try {
    const res = await request.market.order({ data: params });
    return res;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'order error'));
  }
};

export const payOrder = async (params: PayRequest): Promise<boolean> => {
  try {
    await request.market.pay({
      url: `${marketList.pay?.target}/${params?.id}/pay`,
      data: params,
    });
    return true;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'pay error'));
  }
};

export const cancelOrder = async (params: PayRequest): Promise<boolean> => {
  try {
    await request.market.cancel({
      url: `${marketList.cancel?.target}/${params?.id}/cancel`,
      data: params,
    });
    return true;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'cancel error'));
  }
};

export const getAssetsList = async (
  params: GetAssetsListRequest
): Promise<GetAssetsListResponse> => {
  try {
    const res = await request.market.getAssetsList({ params });
    return res;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'getAssetsList error'));
  }
};

export const getAssetsRelate = async (
  params: GetAssetsRelateRequest
): Promise<boolean> => {
  try {
    const res = await request.market.getAssetsRelate({ data: params });
    return res;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'getAssetsRelate error'));
  }
};

export const getBillingsList = async (
  params: GetBillingsListRequest
): Promise<GetBillingsListResponse> => {
  try {
    const res = await request.market.getBillingsList({ params });
    return res;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'getBillingsList error'));
  }
};

export const getBillingsDetail = async (
  params: GetBillingsDetailRequest
): Promise<BillingItem> => {
  try {
    const res = await request.market.getBillingsDetail({ query: params?.id });
    return res;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'getBillingsDetail error'));
  }
};

export const getIsCustomApp = async (
  params: GetIsCustomAppRequest
): Promise<boolean> => {
  try {
    const res = await request.market.getIsCustomApp({ params });
    return res;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'getIsCustomApp error'));
  }
};
