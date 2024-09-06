import Dexie from 'dexie';

const db = new Dexie('GuestDB');
db.version(1).stores({
  appTable:
    '&appId, appName, deployKey, imageUrl, description, sourceCodeUrl, status, createTime, updateTime',
  deployTable: '&appId, deployKey, status, currentVersion, pendingVersion',
  subscriptionTable: '++id, appId, version, status, subscriptionManifest',
  attachmentTable: '++id, appId, version, fileKey, fileName, fileSize',
  appLogTable: 'log_id, timestamp, environment, app_log',
});

export default db;
