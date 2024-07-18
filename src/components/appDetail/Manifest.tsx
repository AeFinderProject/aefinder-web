'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

import { useAppSelector } from '@/store/hooks';

const ReactJson = dynamic(
  async () => {
    const ReactJson = await import('react-json-view').then((module) => module);
    return ReactJson;
  },
  { ssr: false }
);
export default function Manifest() {
  const [manifestJson, setManifestJson] = useState<object>({});
  const { subscriptions, currentVersion } = useAppSelector(
    (state) => state.app
  );

  useEffect(() => {
    if (subscriptions?.currentVersion?.version === currentVersion) {
      setManifestJson(subscriptions?.currentVersion?.subscriptionManifest);
    } else if (subscriptions?.pendingVersion?.version === currentVersion) {
      setManifestJson(subscriptions?.pendingVersion?.subscriptionManifest);
    }
  }, [currentVersion, subscriptions]);

  return (
    <div>
      <ReactJson src={manifestJson}></ReactJson>
    </div>
  );
}
