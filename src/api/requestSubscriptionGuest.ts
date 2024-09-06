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
    console.log(deployItem);
    // step 1.1 if no current version, create a new version
    if (!deployItem) {
      throw new Error('No deploy item found');
    }

    const tempVersion = generateUid();
    console.log(tempVersion);
    if (!deployItem.currentVersion) {
      await db.deployTable.update(appId, {
        currentVersion: tempVersion,
        status: 1,
      });
      await db.subscriptionTable.add({
        appId,
        version: tempVersion,
        status: 1,
        subscriptionManifest: JSON.parse(Manifest),
      });
      if (additionalJSONFileList) {
        for (const file of additionalJSONFileList) {
          await db.attachmentTable.put({
            appId,
            version: tempVersion,
            fileKey: file.uid,
            fileName: file.name,
            fileSize: file.size || 0,
          });
        }
      }
      await db.appTable.update(appId, { status: 1 });
    }
    // step 1.2 if has current version, create a pending version
    if (deployItem.currentVersion && !deployItem.pendingVersion) {
      await db.deployTable.update(appId, {
        pendingVersion: tempVersion,
        status: 1,
      });
      await db.subscriptionTable.put({
        appId,
        version: tempVersion,
        status: 1,
        subscriptionManifest: JSON.parse(Manifest),
      });

      const addAttachmentsWithTransaction = async (
        JSONFileList: UploadFile[]
      ) => {
        await db.transaction('rw', db.attachmentTable, async () => {
          for (const file of JSONFileList) {
            await db.attachmentTable.add({
              appId,
              version: tempVersion,
              fileKey: file.uid,
              fileName: file.name,
              fileSize: file.size || 0,
            });
          }
        });
      };
      if (additionalJSONFileList?.length) {
        // add attachments
        addAttachmentsWithTransaction(additionalJSONFileList)
          .then(() => {
            console.log(
              'All attachments added successfully within a transaction.'
            );
          })
          .catch((error) => {
            console.error('Error adding attachments:', error);
          });
      }

      // if (additionalJSONFileList) {
      //   for (const file of additionalJSONFileList) {
      //     await db.attachmentTable.add({
      //       appId,
      //       version: tempVersion,
      //       fileKey: file.uid,
      //       fileName: file.name,
      //       fileSize: file.size || 0,
      //     });
      //   }
      // }
      await db.appTable.update(appId, { status: 1 });
    }
    // step 1.3 if has pending version, delete pending version, create a new pending version
    if (deployItem.currentVersion && deployItem.pendingVersion) {
      await db.deployTable.update(appId, {
        pendingVersion: tempVersion,
        status: 1,
      });
      await db.subscriptionTable
        .where('version')
        .equals(deployItem.pendingVersion)
        .delete();
      await db.subscriptionTable.add({
        appId,
        version: tempVersion,
        status: 1,
        subscriptionManifest: JSON.parse(Manifest),
      });

      await db.attachmentTable
        .where('version')
        .equals(deployItem.currentVersion)
        .delete();

      if (additionalJSONFileList) {
        for (const file of additionalJSONFileList) {
          await db.attachmentTable.add({
            appId,
            version: tempVersion,
            fileKey: file.uid,
            fileName: file.name,
            fileSize: file.size || 0,
          });
        }
      }

      await db.appTable.update(appId, { status: 1 });
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
    console.log(additionalJSONFileList);
    // need delete file key list: appId version
    const tempAttachment = await db.attachmentTable
      .where({ appId, version })
      .toArray();
    console.log('tempAttachment', tempAttachment);

    const delAttachment = tempAttachment
      ?.map((item) => item.id)
      .filter((id): id is number => id !== undefined);
    console.log('delAttachment', delAttachment);

    if (delAttachment.length > 0) {
      console.log('delAttachment', '====>');
      await db.attachmentTable.bulkDelete(delAttachment);
    }

    const tempAttachment22 = await db.attachmentTable
      .where({ appId, version })
      .toArray();
    console.log('tempAttachment22', tempAttachment22);

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
