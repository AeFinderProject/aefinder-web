import { handleErrorMessage, objectToQueryString } from '@/lib/utils';

import { apiKeyList } from '@/api/list';

import { request } from './index';

import {
  AddApiKeyRequest,
  AddAuthorisedAeIndexerRequest,
  AddAuthorisedDomainRequest,
  ApikeyItemType,
  ApikeyType,
  DeleteApiKeyRequest,
  GetAeIndexerMyListRequest,
  GetAeIndexerMyListResponse,
  GetAeIndexerSnapshotsRequest,
  GetAeIndexersRequest,
  GetAeIndexersResponse,
  GetApiKeysListRequest,
  GetApiKeysListResponse,
  GetAPIRequest,
  GetAPIResponse,
  GetAPISnapshotsRequest,
  GetSnapshotsRequest,
  GetSnapshotsResponse,
  GetSummaryResponse,
  RegenerateApiKeyRequest,
  RegenerateApiKeyResponse,
  RenameApiKeyRequest,
  SetAuthorisedApisRequest,
  SetSpendingLimitRequest,
} from '@/types/apikeyType';

export const getSummary = async (): Promise<GetSummaryResponse> => {
  try {
    const res = await request.apikey.getSummary();
    return res;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'getSummary error'));
  }
};

export const getSnapshots = async (
  params: GetSnapshotsRequest
): Promise<GetSnapshotsResponse> => {
  try {
    console.log('params', params);
    const res = await request.apikey.getSnapshots();
    return res;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'getSnapshots error'));
  }
};

export const addApiKey = async (
  params: AddApiKeyRequest
): Promise<ApikeyType> => {
  try {
    const res = await request.apikey.addApiKey({ data: params });
    return res;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'addApiKey error'));
  }
};

export const getApiKeysList = async (
  params: GetApiKeysListRequest
): Promise<GetApiKeysListResponse> => {
  try {
    const res = await request.apikey.getApiKeysList({ params });
    return res as GetApiKeysListResponse;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'getApiKeysList error'));
  }
};

export const getApiKeyDetail = async (
  params: DeleteApiKeyRequest
): Promise<ApikeyItemType> => {
  try {
    const res = await request.apikey.getApiKeyDetail({ query: params?.id });
    return res;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'getApiKeyDetail error'));
  }
};

export const getApiKeySnapshot = async (
  params: GetSnapshotsRequest
): Promise<GetSnapshotsResponse> => {
  try {
    const query = objectToQueryString({
      beginTime: params?.beginTime,
      endTime: params?.endTime,
      type: params?.type,
    });
    const res = await request.apikey.getApiKeySnapshot({
      url: `${apiKeyList.getApiKeySnapshot}/${params?.id}/snapshots?${query}`,
    });
    return res;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'getApiKeySnapshot error'));
  }
};

export const getAeIndexersList = async (
  params: GetAeIndexersRequest
): Promise<GetAeIndexersResponse> => {
  try {
    const res = await request.apikey.getAeIndexers({
      url: `${apiKeyList.getAeIndexers}/${params?.id}/aeindexers`,
      data: params,
    });
    return res;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'getAeIndexers error'));
  }
};

export const getAeIndexerSnapshots = async (
  params: GetAeIndexerSnapshotsRequest
): Promise<GetSnapshotsResponse> => {
  try {
    const query = objectToQueryString({
      beginTime: params?.beginTime,
      endTime: params?.endTime,
      type: params?.type,
      appId: params?.appId,
    });
    const res = await request.apikey.getAeIndexerSnapshots({
      url: `${apiKeyList.getAeIndexerSnapshots}/${params?.id}/aeindexer-snapshots?${query}`,
    });
    return res;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'getAeIndexerSnapshots error'));
  }
};

export const getAPIList = async (
  params: GetAPIRequest
): Promise<GetAPIResponse> => {
  try {
    const res = await request.apikey.getAPI({
      url: `${apiKeyList.getAPI}/${params?.id}/apis`,
      data: params,
    });
    return res;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'getAPI error'));
  }
};

export const getAPISnapshots = async (
  params: GetAPISnapshotsRequest
): Promise<GetSnapshotsResponse> => {
  try {
    const query = objectToQueryString({
      beginTime: params?.beginTime,
      endTime: params?.endTime,
      type: params?.type,
      api: params?.api,
    });
    const res = await request.apikey.getAPISnapshots({
      url: `${apiKeyList.getAPISnapshots}/${params?.id}/api-snapshots?${query}`,
    });
    return res;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'getAPISnapshots error'));
  }
};

export const renameApiKey = async (
  params: RenameApiKeyRequest
): Promise<boolean> => {
  try {
    console.log(
      'renameApiKey url',
      `${apiKeyList.renameApiKey.target}/${params?.id}`
    );
    await request.apikey.renameApiKey({
      data: { name: params?.name },
      url: `${apiKeyList.renameApiKey.target}/${params?.id}`,
    });
    // no content -> default true
    return true;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'renameApiKey error'));
  }
};

export const regenerateApiKey = async (
  params: RegenerateApiKeyRequest
): Promise<RegenerateApiKeyResponse> => {
  try {
    const res = await request.apikey.regenerateApiKey({
      url: `${apiKeyList.regenerateApiKey.target}/${params?.id}/key`,
    });
    return res;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'regenerateApiKey error'));
  }
};

export const deleteApiKey = async (
  params: DeleteApiKeyRequest
): Promise<boolean> => {
  try {
    await request.apikey.deleteApiKey({
      url: `${apiKeyList.deleteApiKey.target}/${params?.id}`,
    });
    return true;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'deleteApiKey error'));
  }
};

export const setSpendingLimit = async (
  params: SetSpendingLimitRequest
): Promise<boolean> => {
  try {
    await request.apikey.setSpendingLimit({
      url: `${apiKeyList.setSpendingLimit.target}/${params?.id}`,
      data: params,
    });
    return true;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'setSpendingLimit error'));
  }
};

export const addAuthorisedAeIndexer = async (
  params: AddAuthorisedAeIndexerRequest
): Promise<boolean> => {
  try {
    await request.apikey.addAuthorisedAeIndexer({
      url: `${apiKeyList.addAuthorisedAeIndexer.target}/${params?.id}/aeindexer`,
      data: {
        appIds: params?.appIds,
      },
    });
    return true;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'addAuthorisedAeIndexer error'));
  }
};

export const deleteAuthorisedAeIndexer = async (
  params: AddAuthorisedAeIndexerRequest
): Promise<boolean> => {
  try {
    await request.apikey.deleteAuthorisedAeIndexer({
      url: `${apiKeyList.deleteAuthorisedAeIndexer.target}/${params?.id}/aeindexer`,
      data: {
        appIds: params?.appIds,
      },
    });
    return true;
  } catch (error) {
    throw new Error(
      handleErrorMessage(error, 'deleteAuthorisedAeIndexer error')
    );
  }
};

export const addAuthorisedDomain = async (
  params: AddAuthorisedDomainRequest
): Promise<boolean> => {
  try {
    await request.apikey.addAuthorisedDomain({
      url: `${apiKeyList.addAuthorisedDomain.target}/${params?.id}/domain`,
      data: {
        domains: params?.domains,
      },
    });
    return true;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'addAuthorisedDomain error'));
  }
};

export const deleteAuthorisedDomain = async (
  params: AddAuthorisedDomainRequest
): Promise<boolean> => {
  try {
    await request.apikey.deleteAuthorisedDomain({
      url: `${apiKeyList.deleteAuthorisedDomain.target}/${params?.id}/domain`,
      data: {
        domains: params?.domains,
      },
    });
    return true;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'deleteAuthorisedDomain error'));
  }
};

export const setAuthorisedApis = async (
  params: SetAuthorisedApisRequest
): Promise<boolean> => {
  try {
    await request.apikey.setAuthorisedApis({
      url: `${apiKeyList.deleteAuthorisedDomain.target}/${params?.id}/api`,
      data: {
        apis: params?.apis,
      },
    });
    return true;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'setAuthorisedApis error'));
  }
};

export const getAeIndexerMyList = async (
  params: GetAeIndexerMyListRequest
): Promise<GetAeIndexerMyListResponse> => {
  try {
    const res = await request.apikey.getAeIndexerMyList({ params });
    return res;
  } catch (error) {
    throw new Error(handleErrorMessage(error, 'getAeIndexerMyList error'));
  }
};
