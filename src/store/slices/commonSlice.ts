import { createAppSlice } from '@/store/createAppSlice';

import { BalanceType, UserInfoType } from '@/types/appType';

export interface CommonSliceState {
  isLoading: boolean;
  username: string;
  userInfo: UserInfoType;
  usdtBalance: BalanceType;
  elfBalance: BalanceType;
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
    setUsdtBalance: (state, action) => {
      state.usdtBalance = action.payload;
    },
    setElfBalance: (state, action) => {
      state.elfBalance = action.payload;
    },
  },
});

export const {
  setIsLoading,
  setUsername,
  setUserInfo,
  setUsdtBalance,
  setElfBalance,
} = commonSlice.actions;
