export type GetUserAllResponse = {
  id: string;
  displayName: string;
  creationTime: string;
  organizationWalletAddress: string;
  organizationStatus: number;
};

export type GetOrgBalanceResponse = {
  chainId: string;
  address: string;
  symbol: string;
  balance: number;
  lockedBalance: number;
  token: {
    Symbol: string;
  };
};

export type ResourcesLevelItem = {
  productId: string;
  levelName: string;
  capacity: {
    cpu: number;
    memory: string;
    disk: string;
  };
  monthlyUnitPrice: number;
};

export type ResourceBillPlanRequest = {
  productId: string;
  productNum: number;
  periodMonths: number;
};

export type ResourceBillPlanResponse = {
  monthlyUnitPrice: number;
  firstMonthCost: number;
  billingCycleMonthCount: number;
  periodicCost: number;
};

export type CreateOrderRequest = {
  appId?: string;
  productId: string;
  productNumber: number;
  periodMonths: number;
};

export type OrderItem = {
  billingId: string;
  organizationId: string;
  orderId: string;
  subscriptionId: string;
  userId: string;
  appId: string;
  billingType: number;
  billingDate: string;
  description: string;
  billingAmount: number;
  billingStatus: string;
};

export type CreateOrderResponse = OrderItem[];

export type GetFullPodUsageRequest = {
  appId: string;
  version: string;
  skipCount: number;
  maxResultCount: number;
};

export type FullPodUsageItem = {
  appId: string;
  containerName: string;
  appVersion: string;
  currentState: string;
  requestCpu: string;
  requestMemory: string;
  limitCpu: string;
  limitMemory: string;
  usageTimestamp: number;
  cpuUsage: string;
  memoryUsage: string;
};

export type GetFullPodUsageResponse = FullPodUsageItem[];

export type BindOrganizationRequest = {
  organizationName: string;
  email: string;
};

export type OrganizationsItem = {
  organizationName: string;
  organizationId: string;
};

export type BindOrganizationResponse = {
  userName: string;
  email: string;
  emailConfirmed: boolean;
  walletAddress: string;
  organizations: OrganizationsItem[];
};

export type EmailSendCodeRequest = {
  email: string;
};

export type SetNotificationRequest = {
  email: string;
  notification: boolean;
};

export type AppDeployObliterateRequest = {
  appId: string;
};

export type DestroyPendingRequest = {
  appId: string;
};

export type GetTransactionHistoryRequest = {
  skipCount: number;
  maxResultCount: number;
};

export type TransactionHistoryItem = {
  transactionId: string;
  transactionDescription: string;
  transactionAmount: number;
  transactionDate: string;
  balanceAfter: number;
  paymentMethod: string;
};

export type GetTransactionHistoryResponse = {
  totalCount: number;
  items: TransactionHistoryItem[];
};

export type InvoicesItem = {
  id: string;
  billingId: string;
  billingType: number;
  billingDate: string;
  billingStartDate: string;
  billingEndDate: string;
  billingAmount: number;
  description: string;
  billingStatus: number;
  transactionState: string;
};

export type GetInvoicesResponse = {
  totalCount: number;
  items: InvoicesItem[];
};

export type PaymentRequestType = {
  billingId: string;
};

export type PendingBillsItem = {
  billingId: string;
  billingType: number;
  billingAmount: number;
  refundAmount: number;
  billingStatus: number;
  transactionState: string;
  productType: number;
};

export type GetBillingOverviewResponse = {
  apiQueryLockedBalance: number;
  apiQueryDailyCostAverage: number;
  apiQueryMonthlyCostAverage: number;
};

export type GetMerchandisesListRequest = {
  type?: number;
  category?: number;
};

export enum MerchandisesEnum {
  ApiQuery = 0,
  Processor = 1,
  Storage = 2,
}

export enum CategoryEnum {
  ApiQuery = 0,
  ProcessorStorage = 1,
}

export type MerchandisesItem = {
  id: string;
  name: string;
  description: string;
  specification: string;
  unit: string;
  price: number;
  chargeType: number;
  type: MerchandisesEnum;
  category: CategoryEnum;
};

export type GetMerchandisesListResponse = {
  items: MerchandisesItem[];
};

export type GetOrdersListRequest = {
  beginTime?: string;
  endTime?: string;
  status?: number;
  sortType?: number;
  skipCount: number;
  maxResultCount: number;
};

export type AssetsItem = {
  id: string;
  organizationId: string;
  merchandise: MerchandisesItem;
  paidAmount: number;
  quantity: number;
  replicas: number;
  freeQuantity: number;
  freeReplicas: number;
  beginTime: string;
  endTime: string;
  status: number;
  appId: string;
  isLocked: boolean;
};

export type DetailsItem = {
  originalAsset: AssetsItem;
  merchandise: MerchandisesItem;
  quantity: number;
  replicas: number;
  amount: number;
  deductionAmount: number;
  actualAmount: number;
};

export enum OrderStatus {
  Unpaid = 0,
  PaymentPending = 1,
  PaymentConfirmed = 2,
  Canceled = 3,
  PaymentFailed = 4,
}

export enum PaymentType {
  NoType = 0,
  WalletPay = 1,
}

export type NewOrderItemType = {
  id: string;
  organizationId: string;
  details: DetailsItem[];
  amount: number;
  deductionAmount: number;
  actualAmount: number;
  status: OrderStatus;
  paymentType: PaymentType;
  orderTime: string;
  paymentTime: string;
  extraData: {
    appId?: string;
  };
  userId: string;
  transactionId: string;
};

export type GetOrdersListResponse = {
  items: NewOrderItemType[];
  totalCount: number;
};

export type GetOrdersDetailRequest = {
  id?: string;
};

export type WatchOrdersCostItem = {
  originalAssetId: string;
  merchandiseId: string;
  quantity: number;
  replicas: number;
};

export type WatchOrdersCostRequest = {
  details: WatchOrdersCostItem[];
  extraData?: {
    RelateAppId: string;
  };
};

export type PayRequest = {
  id: string;
  paymentType?: number;
};

export type GetAssetsListRequest = {
  appId?: string;
  isFree?: boolean;
  type?: number;
  category?: number;
  skipCount: number;
  maxResultCount: number;
};

export type GetAssetsListResponse = {
  items: AssetsItem[];
  totalCount: number;
};

export type GetAssetsRelateRequest = {
  appId?: string;
  assetIds: string[];
};

export enum BillingEnum {
  SettledBill = 0,
  PreDeductedBill = 1,
}

export enum SortEnum {
  Asc = 0,
  Desc = 1,
}

export type GetBillingsListRequest = {
  startTime?: string;
  endTime?: string;
  type?: BillingEnum;
  sortType: SortEnum;
  skipCount: number;
  maxResultCount: number;
};

export type BillingDetailsItem = {
  name: string;
  appId: string;
  type: number;
  unit: string;
  price: number;
  quantity: number;
  replicas: number;
  refundAmount: number;
  paidAmount: number;
};

export enum BillingType {
  APIQuery = 0,
  Processor = 1,
  Storage = 2,
}

export type BillingItem = {
  id: string;
  organizationId: string;
  beginTime: string;
  endTime: string;
  type: BillingType;
  details: BillingDetailsItem[];
  refundAmount: number;
  paidAmount: number;
  status: number;
  transactionId: string;
  createTime: string;
  paymentTime: string;
};

export type GetBillingsListResponse = {
  items: BillingItem[];
  totalCount: number;
};

export type GetBillingsDetailRequest = {
  id: string;
};

export type GetIsCustomAppRequest = {
  appId: string;
};
