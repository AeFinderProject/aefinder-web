export type CreateSubscriptionRequest = {
  appId: string;
  deployKey: string;
  Manifest: string;
  Code: File;
};

export type CreateSubscriptionResponse = {
  version: string;
};

export type UpdateSubscriptionRequest = {
  appId: string;
  deployKey: string;
  version: string;
  Manifest: string;
};

export type UpdateCode = {
  appId: string;
  deployKey: string;
  version: string;
  Code: File;
};

export type SubscriptionItem = {
  chainId: string;
  startBlockNumber: number;
  onlyConfirmed: boolean;
  transactions: {
    to: string;
    methodNames: string[];
  }[];
  logEvents: {
    contractAddress: string;
    eventNames: string[];
  }[];
};

export type SubscriptionItems = {
  subscriptionItems: SubscriptionItem[];
};

export type VersionType = {
  version: string;
  status: number;
  subscriptionManifest: SubscriptionItems;
};

export type GetSubscriptionResponse = {
  currentVersion: VersionType;
  pendingVersion: VersionType;
};

export type GetDevTemplateRequest = {
  name: string;
};
