'use client';

import { init, WebLoginProvider } from '@aelf-web-login/wallet-adapter-react';
import { ReactNode } from 'react';

import { config } from '@/components/wallet/Config';

export default function WalletLoginProvider({
  children,
}: {
  readonly children: ReactNode;
}) {
  const bridgeAPI = init(config);

  return <WebLoginProvider bridgeAPI={bridgeAPI}>{children}</WebLoginProvider>;
}
