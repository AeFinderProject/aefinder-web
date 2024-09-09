import { UploadFile } from 'antd';

import { ChainIdType } from './appType';

export type CreateSubscriptionRequest = {
  appId: string;
  deployKey: string;
  Manifest: string;
  Code: File;
  additionalJSONFileList?: UploadFile[];
};

export type GetSubscriptionRequest = {
  appId: string;
  deployKey: string;
};

export type GetSubscriptionAttachmentRequest = {
  appId: string;
  deployKey: string;
  version: string;
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

export type UpdateSubscriptionAttachmentRequest = {
  appId: string;
  deployKey: string;
  version: string;
  additionalJSONFileList?: UploadFile[];
  attachmentDeleteFileKeyList?: string;
};

export type UpdateCodeRequest = {
  appId: string;
  deployKey: string;
  version: string;
  Code: File;
  additionalJSONFileList?: UploadFile[];
  AttachmentDeleteFileKeyList?: string;
};

export type SubscriptionItem = {
  chainId: ChainIdType;
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
  SubscriptionItems?: SubscriptionItem[];
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

export type GetSubscriptionAttachmentResponse = {
  fileKey: string;
  version: string;
  appId: string;
  fileName: string;
  fileSize: number;
}[];
