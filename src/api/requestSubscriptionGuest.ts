import type { UploadFile } from 'antd';

import { generateUid, handleErrorMessage } from '@/lib/utils';

import db from '@/api/guestDB';

import {
  CreateSubscriptionRequest,
  GetSubscriptionAttachmentRequest,
  GetSubscriptionAttachmentResponse,
  GetSubscriptionRequest,
  GetSubscriptionResponse,
  UpdateCodeRequest,
  UpdateSubscriptionAttachmentRequest,
  UpdateSubscriptionRequest,
} from '@/types/subscriptionType';

const addAttachments = async (
  appId: string,
  version: string,
  fileList: UploadFile[]
) => {
  const attachments = fileList.map((file) => ({
    appId,
    version,
    fileKey: file.uid,
    fileName: file.name,
    fileSize: file.size ?? 0,
  }));

  await db.attachmentTable.bulkAdd(attachments);
};

const handleNewSubscription = async (
  appId: string,
  tempVersion: string,
  Manifest: string,
  additionalJSONFileList?: UploadFile[]
) => {
  await db.transaction('rw', db.subscriptionTable, async () => {
    await db.subscriptionTable.add({
      appId,
      version: tempVersion,
      status: 1,
      subscriptionManifest: JSON.parse(Manifest),
    });
  });

  if (additionalJSONFileList) {
    await addAttachments(appId, tempVersion, additionalJSONFileList);
  }

  await db.appTable.update(appId, { status: 1 });
  await db.deployTable.update(appId, {
    currentVersion: tempVersion,
    status: 1,
  });
};

const handlePendingVersion = async (
  appId: string,
  tempVersion: string,
  Manifest: string,
  additionalJSONFileList?: UploadFile[]
) => {
  await db.subscriptionTable.add({
    appId,
    version: tempVersion,
    status: 1,
    subscriptionManifest: JSON.parse(Manifest),
  });

  if (additionalJSONFileList) {
    await addAttachments(appId, tempVersion, additionalJSONFileList);
  }

  await db.appTable.update(appId, { status: 1 });
  await db.deployTable.update(appId, {
    pendingVersion: tempVersion,
    status: 1,
  });
};

const replacePendingVersion = async (
  appId: string,
  tempVersion: string,
  Manifest: string,
  additionalJSONFileList?: UploadFile[],
  currentVersion?: string,
  oldPendingVersion?: string
) => {
  await db.deployTable.update(appId, {
    pendingVersion: tempVersion,
    status: 1,
  });

  oldPendingVersion &&
    (await db.subscriptionTable
      .where('version')
      .equals(oldPendingVersion)
      .delete());

  await db.subscriptionTable.add({
    appId,
    version: tempVersion,
    status: 1,
    subscriptionManifest: JSON.parse(Manifest),
  });

  currentVersion &&
    (await db.attachmentTable.where('version').equals(currentVersion).delete());

  if (additionalJSONFileList) {
    await addAttachments(appId, tempVersion, additionalJSONFileList);
  }

  await db.appTable.update(appId, { status: 1 });
};

export const addSubscriptionGuest = async (
  params: CreateSubscriptionRequest
): Promise<boolean> => {
  // deploy true or false
  try {
    const { appId, Manifest, additionalJSONFileList } = params;
    // step 1 upload the Manifest file
    // step 2 ignore the Code file
    // step 3 update app deploy subscription status
    // step 4 delete old additionalJSONFileList and add the new additionalJSONFileList

    const deployItem = await db.deployTable.get({ appId });
    // step 1.1 if no current version, create a new version
    if (!deployItem) {
      throw new Error('No deploy item found');
    }

    const tempVersion = generateUid();

    if (!deployItem.currentVersion) {
      // 1 have no currentVersion
      await handleNewSubscription(
        appId,
        tempVersion,
        Manifest,
        additionalJSONFileList
      );
    } else if (!deployItem.pendingVersion) {
      // 2 have currentVersion, have no  pendingVersion
      await handlePendingVersion(
        appId,
        tempVersion,
        Manifest,
        additionalJSONFileList
      );
    } else {
      // 3 both: currentVersion, pendingVersion
      await replacePendingVersion(
        appId,
        tempVersion,
        Manifest,
        additionalJSONFileList,
        deployItem.currentVersion,
        deployItem.pendingVersion
      );
    }

    return true;
  } catch (error) {
    console.log('error', error);
    return false;
  }
};

export const updateSubscriptionGuest = async (
  params: UpdateSubscriptionRequest
): Promise<boolean> => {
  try {
    const { appId, version, Manifest } = params;
    await db.subscriptionTable
      .filter((item) => item.appId === appId && item.version === version)
      .modify({
        subscriptionManifest: JSON.parse(Manifest),
      });

    // no content -> default true
    return true;
  } catch (error) {
    if (error === 'No Content') {
      return true;
    } else {
      throw new Error(handleErrorMessage(error, 'updateSubscription error'));
    }
  }
};

export const updateCodeGuest = async (
  params: UpdateCodeRequest
): Promise<boolean> => {
  try {
    const { appId, version, additionalJSONFileList } = params;
    // need delete file key list: appId version
    const tempAttachment = await db.attachmentTable
      .where({ appId, version })
      .toArray();

    const delAttachment = tempAttachment
      ?.map((item) => item.id)
      .filter((id): id is number => id !== undefined);

    if (delAttachment.length > 0) {
      await db.attachmentTable.bulkDelete(delAttachment);
    }

    if (additionalJSONFileList) {
      for (const file of additionalJSONFileList) {
        await db.attachmentTable.add({
          appId: appId,
          version: version,
          fileKey: file.uid,
          fileName: file.name,
          fileSize: file.size || 0,
        });
      }
    }

    return true;
  } catch (error) {
    console.log('error', error);
    return false;
  }
};

export const getSubscriptionsGuest = async (
  params: GetSubscriptionRequest
): Promise<GetSubscriptionResponse> => {
  const response = {} as GetSubscriptionResponse;
  try {
    const { appId } = params;

    const appDeployDetail = await db.deployTable.get(appId);
    if (!appDeployDetail) {
      throw new Error('App not deployed');
    }

    if (appDeployDetail?.currentVersion) {
      const subscriptionItem = await db.subscriptionTable.get({
        appId,
        version: appDeployDetail?.currentVersion,
      });
      if (!subscriptionItem) {
        throw new Error('Subscription not found');
      }
      response.currentVersion = {
        version: appDeployDetail?.currentVersion,
        status: appDeployDetail?.status,
        subscriptionManifest: subscriptionItem.subscriptionManifest,
      };
    }

    if (appDeployDetail?.pendingVersion) {
      const subscriptionItem = await db.subscriptionTable.get({
        appId,
        version: appDeployDetail?.pendingVersion,
      });
      if (!subscriptionItem) {
        throw new Error('Subscription not found');
      }
      response.pendingVersion = {
        version: appDeployDetail?.pendingVersion,
        status: appDeployDetail?.status,
        subscriptionManifest: subscriptionItem?.subscriptionManifest,
      };
    }

    return response;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'getSubscription error'));
  }
};

export const updateSubscriptionAttachmentsGuest = async (
  params: UpdateSubscriptionAttachmentRequest
): Promise<boolean> => {
  try {
    const { appId, version, additionalJSONFileList } = params;

    // need delete file key list: appId version
    await db.attachmentTable
      .filter((item) => item.appId === appId && item.version === version)
      .delete();
    if (additionalJSONFileList) {
      for (const file of additionalJSONFileList) {
        await db.attachmentTable.add({
          appId,
          version: version,
          fileKey: file.uid,
          fileName: file.name,
          fileSize: file.size || 0,
        });
      }
    }

    return true;
  } catch (error) {
    console.log('error', error);
    return false;
  }
};

export const getSubscriptionsAttachmentsGuest = async (
  params: GetSubscriptionAttachmentRequest
): Promise<GetSubscriptionAttachmentResponse> => {
  try {
    const { appId, version } = params;
    const attachmentList =
      (await db.attachmentTable
        .filter((item) => item.appId === appId && item.version === version)
        .toArray()) || [];

    return attachmentList as GetSubscriptionAttachmentResponse;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'getSubscription error'));
  }
};
