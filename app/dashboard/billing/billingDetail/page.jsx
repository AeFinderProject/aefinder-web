'use client';

// eslint-disable-next-line
import React, { useEffect, useState } from 'react';

import { getBillingsDetail } from '@/api/requestMarket';
import { useDebounceCallback } from '@/lib/utils';
import { queryAuthToken } from '@/api/apiUtils';
import { BillingItem } from '@/types/marketType';

export default function BillingDetail() {
  const [billingId, setBillingId] = useState('');
  const [currentBillingDetail, setCurrentBillingDetail] =
    (useState < BillingItem) | (null > null);

  console.log('currentBillingDetail', currentBillingDetail);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!billingId) {
        const searchParams = new URLSearchParams(window.location.search);
        setBillingId(searchParams.get('billingId') || '');
      } else {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [billingId]);

  const getAppDetailTemp = useDebounceCallback(async () => {
    await queryAuthToken();
    if (billingId) {
      const res = await getBillingsDetail({ id: String(billingId) });
      setCurrentBillingDetail(res);
    }
  }, [billingId]);

  useEffect(() => {
    getAppDetailTemp();
  }, [getAppDetailTemp]);

  return (
    <div>
      <h1>BillingDetail</h1>
    </div>
  );
}
