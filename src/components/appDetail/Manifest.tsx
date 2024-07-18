import { useEffect, useState } from 'react';
import ReactJson from 'react-json-view';

import { useAppSelector } from '@/store/hooks';
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
