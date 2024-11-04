'use client';
// eslint-disable-next-line
import dynamic from 'next/dynamic';
import Script from 'next/script';

import { ConfigProvider } from 'antd';

import theme from '@/lib/themeConfig';
import MyLayout from '@/components/layout/Layout';
import { StoreProvider } from '@/components/layout/StoreProvider';

import '@/styles/globals.css';

const WalletLoginProviderDynamic = dynamic(
  async () => {
    const WalletLoginProvider = await import(
      '@/components/wallet/WalletLoginProvider'
    ).then((module) => module);
    return WalletLoginProvider;
  },
  { ssr: false }
);

const LoginProviderDynamic = dynamic(
  async () => {
    const LoginProvider = await import(
      '@/components/layout/WebLoginProvider'
    ).then((module) => module);
    return LoginProvider;
  },
  { ssr: false }
);

const OpentelemetryProvider = dynamic(
  () =>
    import('@/components/layout/opentelemetryProvider').then(
      (mod) => mod.OpentelemetryProvider
    ),
  { ssr: false }
);

function MyApp({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
        <title>AeFinder | Finding data is easier</title>
        <meta
          name='description'
          content='AeFinder is a powerful decentralised protocol used for indexing and querying the data of the blockchain'
        />
        <link rel='icon' href='/assets/favicon.ico' />
        {/* eslint-disable-next-line */}
        <link
          href='https://fonts.googleapis.com/css2?family=Roboto&display=swap'
          rel='stylesheet'
        />
      </head>
      <body style={{ fontFamily: 'Roboto' }}>
        <StoreProvider>
          <LoginProviderDynamic>
            <ConfigProvider theme={theme}>
              <WalletLoginProviderDynamic>
                <MyLayout>
                  <OpentelemetryProvider>{children}</OpentelemetryProvider>
                </MyLayout>
              </WalletLoginProviderDynamic>
            </ConfigProvider>
          </LoginProviderDynamic>
        </StoreProvider>
        <Script
          async
          src='https://www.googletagmanager.com/gtag/js?id=G-X7GQ98KQ35'
        ></Script>
        <Script id='google-analytics'>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          
            gtag('config', 'G-X7GQ98KQ35');
          `}
        </Script>
      </body>
    </html>
  );
}

export default MyApp;
