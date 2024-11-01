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
  walletAddress: string;
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
