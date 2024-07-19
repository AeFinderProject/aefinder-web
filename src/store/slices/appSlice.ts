import { createAppSlice } from '@/store/createAppSlice';

import { CreateAppResponse, GetAppDetailResponse } from '@/types/appType';
import { GetSubscriptionResponse } from '@/types/subscriptionType';

export interface AppSliceState {
  currentAppDetail: GetAppDetailResponse;
  currentVersion: string;
  appList: CreateAppResponse[];
  subscriptions: GetSubscriptionResponse;
}

const initialState: AppSliceState = {
  currentAppDetail: {} as GetAppDetailResponse,
  currentVersion: '',
  appList: [],
  subscriptions: {} as GetSubscriptionResponse,
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
  },
});

export const {
  setAppList,
  setCurrentAppDetail,
  setCurrentVersion,
  setSubscriptions,
} = appSlice.actions;
