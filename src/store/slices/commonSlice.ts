import { createAppSlice } from '@/store/createAppSlice';

import { BalanceType, UserInfoType } from '@/types/appType';
import { GetOrgBalanceResponse, GetUserAllResponse } from '@/types/marketType';

export interface CommonSliceState {
  isLoading: boolean;
  username: string;
  userInfo: UserInfoType;
  orgUser: GetUserAllResponse;
  usdtBalance: BalanceType;
  elfBalance: BalanceType;
  orgBalance: GetOrgBalanceResponse;
}

const initialState: CommonSliceState = {
  isLoading: false,
  username: '',
  userInfo: {
    userName: '',
    email: '',
    emailConfirmed: false,
    notification: false,
    walletAddress: '',
  },
  orgUser: {
    id: '',
    displayName: '',
    creationTime: '',
    organizationWalletAddress: '',
    organizationStatus: 0,
  },
  usdtBalance: {
    balance: '0',
    owner: '',
    symbol: 'USDT',
  },
  elfBalance: {
    balance: '0',
    owner: '',
    symbol: 'ELF',
  },
  orgBalance: {
    chainId: '',
    address: '',
    symbol: 'USDT',
    balance: 0,
    lockedBalance: 0,
    token: {
      Symbol: 'USDT',
    },
  },
};

export const commonSlice = createAppSlice({
  name: 'common',
  initialState,
  reducers: {
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    setOrgUser: (state, action) => {
      state.orgUser = action.payload;
    },
    setUsdtBalance: (state, action) => {
      state.usdtBalance = action.payload;
    },
    setElfBalance: (state, action) => {
      state.elfBalance = action.payload;
    },
    setOrgBalance: (state, action) => {
      state.orgBalance = action.payload;
    },
  },
});

export const {
  setIsLoading,
  setUsername,
  setUserInfo,
  setOrgUser,
  setUsdtBalance,
  setElfBalance,
  setOrgBalance,
} = commonSlice.actions;
