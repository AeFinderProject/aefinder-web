'use client';
import { Tracer } from '@opentelemetry/sdk-trace-base';
import { initWebTracerWithZone } from 'opentelemetry-launcher';
import { createContext, ReactNode, useEffect, useMemo, useState } from 'react';

import { CollectorEndpoint } from '@/constant';

interface Props {
  readonly children: ReactNode;
}

export const OpentelemetryContext = createContext<Tracer | undefined>(
  undefined
);

export const OpentelemetryProvider = ({ children }: Props) => {
  const network = process.env.NEXT_PUBLIC_NETWORK_KEY ?? 'testnet';
  const prefix = network === 'mainnet' ? 'mainnet' : 'testnet';
  const [webTracerWithZone, setWebTracerWithZone] = useState<Tracer>();
  const APP_SETTINGS = useMemo(() => {
    return {
      openTelemetry: {
        serviceName: 'aefinder-web-' + prefix,
        serviceVersion: '2.14.0',
        collectorEndpoint: CollectorEndpoint,
        tracerName: `aefinder-web-${prefix}-tracer`,
        ignoreUrls: [
          /\/sockjs-node/,
          /\/monitoring/,
          /\/__nextjs_original-stack-frame/,
          /_rsc=/,
          /https:\/\/www\.google-analytics\.com\/g\/collect/,
          /\/api\/apps\/log/,
        ],
        propagateTraceHeaderCorsUrls: [
          'https://httpbin.org',
          /otel.aelf.com\/v1\/traces/,
          /gcptest-indexer-api\.aefinder\.io/,
          /gcptest-indexer-auth\.aefinder\.io/,
          /indexer-api\.aefinder\.io/,
          /indexer-auth\.aefinder\.io/,
        ],
      },
    };
  }, [prefix]);

  useEffect(() => {
    const _webTracerWithZone = initWebTracerWithZone(
      APP_SETTINGS.openTelemetry
    );
    setWebTracerWithZone(_webTracerWithZone);
    console.log('getWebTracerWithZone done');
  }, [APP_SETTINGS.openTelemetry]);

  return (
    <OpentelemetryContext.Provider value={webTracerWithZone}>
      {children}
    </OpentelemetryContext.Provider>
  );
};
