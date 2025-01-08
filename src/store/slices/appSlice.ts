import { createAppSlice } from '@/store/createAppSlice';

import {
  AeIndexersItem,
  ApiItem,
  ApikeyItemType,
  GetSummaryResponse,
} from '@/types/apikeyType';
import { CreateAppResponse, GetAppDetailResponse } from '@/types/appType';
import { GetUserAllResponse } from '@/types/marketType';
import { GetSubscriptionResponse } from '@/types/subscriptionType';

export interface AppSliceState {
  currentAppDetail: GetAppDetailResponse;
  currentVersion: string;
  appList: CreateAppResponse[];
  subscriptions: GetSubscriptionResponse;
  apikeySummary: GetSummaryResponse;
  apikeyList: ApikeyItemType[];
  apikeyDetail: ApikeyItemType;
  defaultAeindexersList: AeIndexersItem[];
  defaultAPIList: ApiItem[];
  orgUserAll: GetUserAllResponse;
  freeApiQueryCount: number;
}

const initialState: AppSliceState = {
  currentAppDetail: {} as GetAppDetailResponse,
  currentVersion: '',
  appList: [],
  subscriptions: {} as GetSubscriptionResponse,
  apikeySummary: {
    queryLimit: 0,
    query: 0,
    apiKeyCount: 0,
  } as GetSummaryResponse,
  apikeyList: [],
  apikeyDetail: {} as ApikeyItemType,
  defaultAeindexersList: [],
  defaultAPIList: [],
  orgUserAll: {} as GetUserAllResponse,
  freeApiQueryCount: 0,
};

export const appSlice = createAppSlice({
  name: 'app',
  initialState,
  reducers: {
    setAppList: (state, action) => {
      state.appList = action.payload;
    },
    setCurrentAppDetail: (state, action) => {
      state.currentAppDetail = action.payload;
    },
    setCurrentVersion: (state, action) => {
      state.currentVersion = action.payload;
    },
    setSubscriptions: (state, action) => {
      state.subscriptions = action.payload;
    },
    setApikeySummary: (state, action) => {
      state.apikeySummary = action.payload;
    },
    setApikeyList: (state, action) => {
      state.apikeyList = action.payload;
    },
    setApikeyDetail: (state, action) => {
      state.apikeyDetail = action.payload;
    },
    setDefaultAeIndexersList: (state, action) => {
      state.defaultAeindexersList = action.payload;
    },
    setDefaultAPIList: (state, action) => {
      state.defaultAPIList = action.payload;
    },
    setOrgUserAll: (state, action) => {
      state.orgUserAll = action.payload;
    },
    setFreeApiQueryCount: (state, action) => {
      state.freeApiQueryCount = action.payload;
    },
  },
});

export const {
  setAppList,
  setCurrentAppDetail,
  setCurrentVersion,
  setSubscriptions,
  setApikeySummary,
  setApikeyList,
  setApikeyDetail,
  setDefaultAeIndexersList,
  setDefaultAPIList,
  setOrgUserAll,
  setFreeApiQueryCount,
} = appSlice.actions;
