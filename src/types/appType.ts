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
  CreateTime: number;
  UpdateTime: number;
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

export type GetLogRequest = {
  appId: string;
  version: string;
  startTime: string;
  logId: string;
};

export type GetLogResponse = {
  id: string;
  timestamp: string;
  environment: string;
  app_log: {
    eventId: number;
    time: string;
    message: string;
    level: 'Debug' | 'Error' | 'Warn' | 'Info';
    exception: string;
    appId: string;
    version: string;
  };
};
