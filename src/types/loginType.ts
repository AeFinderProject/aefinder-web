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
  address: string;
};

export enum ExploreUrlType {
  AELF = 'https://explorer.aelf.io',
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
