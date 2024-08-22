'use client';
import { Tracer } from '@opentelemetry/sdk-trace-base';
import { initWebTracerWithZone } from 'opentelemetry-launcher';
import { createContext, ReactNode, useEffect, useMemo, useState } from 'react';

import { AeFinderAuthHost, AeFinderHost, CollectorEndpoint } from '@/constant';

interface Props {
  readonly children: ReactNode;
}

export const OpentelemetryContext = createContext<Tracer | undefined>(
  undefined
);

export const OpentelemetryProvider = ({ children }: Props) => {
  const { NEXT_PUBLIC_NETWORK_KEY } = process.env;
  const isMainNet = NEXT_PUBLIC_NETWORK_KEY === 'mainnet';
  const prefix = isMainNet ? 'mainnet' : 'testnet';
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
          CollectorEndpoint,
          AeFinderHost,
          AeFinderAuthHost,
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
