export type LoginRequest = {
  username: string;
  password: string;
  scope: string;
  grant_type: string;
  client_id: string;
};

export type GetAccessTokenRequest = {
  grant_type: string;
  scope: string;
  client_id: string;
  client_secret: string;
};

export type ResetPasswordRequest = {
  userName: string;
  newPassword: string;
};

export type BindWalletRequest = {
  timestamp: number;
  signatureVal: string;
  chainId: string;
  caHash?: string;
  publicKey: string;
  address: string;
};

export type BindWalletResponse = {
  userName: string;
  email: string;
  emailConfirmed: boolean;
  walletAddress: string;
};

export enum ExploreUrlType {
  AELF = 'https://aelfscan.io',
  SETH = 'https://sepolia.etherscan.io',
  ETH = 'https://etherscan.io',
  MATIC = 'https://polygonscan.com',
  ARBITRUM = 'https://arbiscan.io',
  OPTIMISM = 'https://optimistic.etherscan.io',
  Solana = 'https://explorer.solana.com',
  TRX = 'https://tronscan.io',
  BSC = 'https://bscscan.com',
  AVAXC = 'https://subnets.avax.network/c-chain',
}

export type RegisterRequest = {
  userName: string;
  password: string;
  email: string;
  organizationName: string;
};

export type ResendRequest = {
  email: string;
};

export type EmailVerificationRequest = {
  code: string;
};
