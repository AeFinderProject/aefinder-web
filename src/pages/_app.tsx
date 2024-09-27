import { ConfigProvider } from 'antd';
import { AppProps } from 'next/app';
import dynamic from 'next/dynamic';

import '@/styles/globals.css';

import theme from '@/lib/themeConfig';

import Layout from '@/components/layout/Layout';
import { StoreProvider } from '@/components/layout/StoreProvider';
import Seo from '@/components/Seo';

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

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <StoreProvider>
      <LoginProviderDynamic>
        <ConfigProvider theme={theme}>
          <Layout>
            <OpentelemetryProvider>
              <Seo templateTitle='AeFinder' />
              <Component {...pageProps} />
            </OpentelemetryProvider>
          </Layout>
        </ConfigProvider>
      </LoginProviderDynamic>
    </StoreProvider>
  );
}

export default MyApp;
