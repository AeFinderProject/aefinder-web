export type AuthorisedAeIndexers = {
  appId: string;
  appName: string;
};

export type ApikeyType = {
  id: string;
  name: string;
  key: string;
  isActive: boolean;
  periodQuery: number;
  isEnableSpendingLimit: boolean;
  spendingLimitUsdt: number;
  totalQuery: number;
  createTime: string;
  updateTime: string;
  isDeleted: boolean;
  lastQueryTime: string;
  organizationId: string;
};

export type ApikeyItemType = {
  authorisedAeIndexers: AuthorisedAeIndexers[];
  authorisedDomains: string[];
  authorisedApis: number[];
} & ApikeyType;

export type GetSummaryResponse = {
  queryLimit: number;
  query: number;
  totalQuery: number;
  apiKeyCount: number;
  lastQueryTime: string;
  organizationId: string;
  maxApiKeyCount: number;
};

export type GetSnapshotsRequest = {
  id: string;
  beginTime: string;
  endTime: string;
  type: number | string;
};

export type SnapshotsItemType = {
  time: string;
  query: number;
};

export type GetSnapshotsResponse = {
  items: SnapshotsItemType[];
};

export type AddApiKeyRequest = {
  name: string;
  isEnableSpendingLimit: boolean;
  spendingLimitUsdt: number;
};

export type GetApiKeysListRequest = {
  id?: string;
  skipCount: number;
  maxResultCount: number;
};

export type GetApiKeysListResponse = {
  items: ApikeyItemType[];
  totalCount: number;
};

export type GetAeIndexersRequest = {
  appId?: string;
} & GetApiKeysListRequest;

export type AeIndexersItem = {
  appId: string;
  appName: string;
  totalQuery: number;
  lastQueryTime: string;
};

export type GetAeIndexersResponse = {
  items: AeIndexersItem[];
  totalCount: number;
};

export type GetAeIndexerSnapshotsRequest = {
  appId?: string;
} & GetSnapshotsRequest;

export type GetAPIRequest = {
  api?: string | number;
} & GetApiKeysListRequest;

export enum ApiType {
  Block = 0,
  Transaction = 1,
  LogEvent = 2,
}

export type ApiItem = {
  api: 0 | 1 | 2;
  totalQuery: number;
  lastQueryTime: string;
};

export type GetAPIResponse = {
  items: ApiItem[];
  totalCount: number;
};

export type GetAPISnapshotsRequest = {
  api?: number;
} & GetSnapshotsRequest;

export type RenameApiKeyRequest = {
  id: string;
  name: string;
};

export type RegenerateApiKeyRequest = {
  id: string;
};

export type RegenerateApiKeyResponse = {
  key: string;
};

export type DeleteApiKeyRequest = {
  id: string;
};

export type SetSpendingLimitRequest = {
  id: string;
  isEnableSpendingLimit: boolean;
  spendingLimitUsdt: number;
};

export type AddAuthorisedAeIndexerRequest = {
  id: string;
  appIds: string[];
};

export type AddAuthorisedDomainRequest = {
  id: string;
  domains: string[];
};

export type SetAuthorisedApisRequest = {
  id: string;
  apis: object;
};

export type GetAeIndexerMyListRequest = {
  keyword: string;
};
