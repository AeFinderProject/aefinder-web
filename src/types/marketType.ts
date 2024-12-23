export type GetUserAllResponse = {
  id: string;
  displayName: string;
  creationTime: string;
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

export type GetResourcesFullRequest = {
  appId: string;
};

export type GetResourcesLevelResponse = ResourcesLevelItem[];

export type GetRegularResponse = {
  productId: string;
  queryCount: string;
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

export type GetPendingBillsResponse = PendingBillsItem[];
