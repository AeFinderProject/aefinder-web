import { createAppSlice } from '@/store/createAppSlice';

import { CreateAppResponse, GetAppDetailResponse } from '@/types/appType';

export interface appSliceState {
  currentAppDetail: GetAppDetailResponse;
  currentVersion: string;
  appList: CreateAppResponse[];
}

const initialState: appSliceState = {
  currentAppDetail: {} as GetAppDetailResponse,
  currentVersion: '',
  appList: [],
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
  },
});

export const { setAppList, setCurrentAppDetail, setCurrentVersion } =
  appSlice.actions;
