export type CreateAppRequest = {
  appName: string;
};

export enum AppStatusType {
  Deployed = 1,
  UnDeployed = 0,
}

export interface CreateAppResponse {
  appId: string;
  deployKey?: string;
  appName: string;
  imageUrl: string;
  description: string;
  sourceCodeUrl: string;
  status: number; // 0: UnDeployed, 1: Deployed
  createTime: number;
  updateTime: number;
}

export type ModifyAppRequest = {
  appId: string;
  description: string;
  sourceCodeUrl: string;
};

export type GetAppDetailRequest = {
  appId: string;
};

export type GetAppDetailResponse = {
  versions: {
    currentVersion: string;
    pendingVersion: string;
  };
} & CreateAppResponse;

export type GetAppListResponse = {
  items: CreateAppResponse[];
  totalCount: number;
};

export type UserInfoType = {
  userName: string;
  email: string;
  emailConfirmed: boolean;
  walletAddress: string;
  notification: boolean;
};

export type LevelType = 'Debug' | 'Error' | 'Warning' | 'Information';
export type ChainIdType = 'tDVV' | 'tDVW' | 'AELF' | '';

export type GetLogRequest = {
  appId: string;
  version: string;
  startTime: string;
  logId: string;
  searchKeyWord: string;
  chainId: ChainIdType;
  levels: Array<LevelType>;
};

export type GetLogResponse = {
  log_id: string;
  timestamp: string;
  environment: string;
  app_log: {
    eventId: number;
    time: string;
    message: string;
    level: LevelType;
    exception: string;
    appId: string;
    chainId: string;
    version: string;
  };
};

export enum CurrentTourStepEnum {
  InitTour = 'InitTour',
  CreateAeIndexer = 'CreateAeIndexer',
  HaveCreateAeIndexer = 'HaveCreateAeIndexer',
  DeployAeIndexer = 'DeployAeIndexer',
  HaveDeployAeIndexer = 'HaveDeployAeIndexer',
  UpdateAeIndexer = 'UpdateAeIndexer',
  PlaygroundAeIndexer = 'PlaygroundAeIndexer',
  LogAeIndexer = 'LogAeIndexer',
}

export type BalanceType = {
  balance: string;
  owner: string;
  symbol: string;
};

export type GetBalanceResponseType = {
  data: BalanceType;
};

export type ApproveResponseType = {
  data: {
    transactionId: string;
    Status: string;
    Logs: {
      Address: string;
      Name: string;
      Indexed: string[];
      NonIndexed: string;
    }[];
    Bloom: string;
    BlockNumber: number;
    BlockHash: string;
    Transaction: {
      From: string;
      To: string;
      RefBlockNumber: string;
      RefBlockPrefix: string;
      MethodName: string;
      Params: object;
      Signature: string;
    };
    ReturnValue: string;
    Error: string;
    TransactionSize: number;
  };
  transactionId: string;
};
