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
