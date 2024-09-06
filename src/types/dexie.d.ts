import 'dexie';

import { SubscriptionItems } from './subscriptionType';

declare module 'dexie' {
  interface Dexie {
    appTable: Dexie.Table<AppTable, string>;
    deployTable: Dexie.Table<DeployTable, string>;
    subscriptionTable: Dexie.Table<SubscriptionTable, number>;
    attachmentTable: Dexie.Table<AttachmentTable, number>;
    appLogTable: Dexie.Table<AppLogTable, string>;
  }

  interface AppTable {
    appId?: string;
    deployKey?: string;
    appName: string;
    imageUrl: string;
    description: string;
    sourceCodeUrl: string;
    status: number;
    createTime: number;
    updateTime: number;
  }

  interface DeployTable {
    appId: string;
    deployKey: string;
    status: number;
    currentVersion: string;
    pendingVersion: string;
  }

  interface SubscriptionTable {
    id?: number;
    appId: string;
    version: string;
    status: number;
    subscriptionManifest: SubscriptionItems;
  }

  interface AttachmentTable {
    id?: number;
    appId: string;
    version: string;
    fileKey: string;
    fileName: string;
    fileSize: number;
  }

  interface AppLogItem {
    eventId: number;
    time: string;
    message: string;
    level: LevelType;
    exception: string;
    appId: string;
    version: string;
  }

  interface AppLogTable {
    log_id: string;
    timestamp: string;
    environment: string;
    app_log: AppLogItem;
  }
}
