export type GetUserAllResponse = {
  id: string;
  displayName: string;
  creationTime: string;
};

export type GetOrgBalanceRequest = {
  organizationId: string;
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
  organizationId: string;
  appId: string;
};

export type GetApiQueryCountFreeRequest = {
  organizationId: string;
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
  MonthlyUnitPrice: number;
  firstMonthCost: number;
  billingCycleMonthCount: number;
  PeriodicCost: number;
};

export type CreateOrderRequest = {
  appId: string;
  organizationId: string;
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
  organizationId: string;
};

export type DestroyPendingRequest = {
  appId: string;
};

export type GetTransactionHistoryRequest = {
  organizationId: string;
};

export type TransactionHistoryItem = {
  transactionId: string;
  transactionDescription: string;
  transactionAmount: number;
  transactionDate: string;
  BalanceAfter: number;
  PaymentMethod: string;
};

export type GetTransactionHistoryResponse = {
  totalCount: number;
  items: TransactionHistoryItem[];
};

export type GetInvoicesRequest = {
  organizationId: string;
};

export type InvoicesItem = {
  BillingId: string;
  BillingType: number;
  BillingDate: string;
  BillingStartDate: string;
  BillingEndDate: string;
  BillingAmount: number;
  Description: string;
  BillingStatus: number;
};

export type GetInvoicesResponse = {
  totalCount: number;
  items: InvoicesItem[];
};
