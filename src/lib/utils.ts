'use client';

import { message } from 'antd';
import BigNumber from 'bignumber.js';
import BN, { isBN } from 'bn.js';
import clsx, { ClassValue } from 'clsx';
import dayjs from 'dayjs';
import pako from 'pako';
import { DependencyList, useCallback, useRef } from 'react';
import { twMerge } from 'tailwind-merge';

import { ChainIdType } from '@/types/appType';
import { ExploreUrlType } from '@/types/loginType';

/** Merge classes with tailwind-merge with clsx full feature */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * that deal with the debounced function.
 */
// eslint-disable-next-line
export function useDebounceCallback<T extends (...args: any[]) => any>(
  callback: T | undefined,
  deps: DependencyList,
  delay = 500
) {
  const timer = useRef<NodeJS.Timeout | number>();
  const callbackRef = useLatestRef(callback);
  // eslint-disable-next-line
  return useCallback((...args: any[]) => {
    if (!callbackRef.current) return;
    timer.current && clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      callbackRef.current?.(...args);
    }, delay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/**
 * that deal with the throttled function.
 */
// eslint-disable-next-line
export function useThrottleCallback<T extends (...args: any[]) => any>(
  callback: T | undefined,
  deps: DependencyList,
  delay = 500
) {
  const lock = useRef<number>();
  // eslint-disable-next-line
  return useCallback((...args: any[]) => {
    if (!callback) return;
    const now = Date.now();
    if (lock.current && lock.current + delay > now) return;
    lock.current = now;
    return callback(...args);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
/**
 * returns the latest value, effectively avoiding the closure problem.
 */
export function useLatestRef<T>(value: T) {
  const ref = useRef(value);
  ref.current = value;

  return ref;
}

// eslint-disable-next-line
export function handleErrorMessage(error: any, errorText?: string) {
  if (
    error.status === 500 ||
    error.status === 501 ||
    error.status === 502 ||
    error.status === 503
  ) {
    return errorText ?? 'Failed to fetch data';
  }
  console.log('error', error?.response);
  // common error
  error = error?.response || error;
  // login timeout
  if (error?.status === 401) {
    message.info('Need login');
    window.location.href = '/login';
    return;
  }
  // connect token error
  error = error?.data?.error_description || error;
  // api error
  error = error?.data?.error || error;
  if (typeof error === 'string') errorText = error;
  if (typeof error.message === 'string') errorText = error.message;
  if (error?.validationErrors && typeof error?.validationErrors === 'object') {
    // eslint-disable-next-line
    error = error?.validationErrors[0];
    errorText = error?.message;
  }
  if (error?.details && typeof error?.details === 'string') {
    errorText = error?.details;
  }
  message.error(errorText, 3);
  return error;
}

export function isValidJSON(text: string) {
  try {
    JSON.parse(text);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * this function is to format address,just like "formatStr2EllipsisStr" ---> "for...Str"
 * @param address
 * @param digits [pre_count, suffix_count]
 * @param type
 * @returns
 */
export const formatStr2Ellipsis = (
  address = '',
  digits = [10, 10],
  type: 'middle' | 'tail' = 'middle'
): string => {
  if (!address) return '';

  const len = address.length;

  if (type === 'tail') return `${address.slice(0, digits[0])}...`;

  if (len < digits[0] + digits[1]) return address;
  const pre = address.substring(0, digits[0]);
  const suffix = address.substring(len - digits[1]);
  return `${pre}...${suffix}`;
};

export const readAndCompressFile = async (file: File): Promise<Blob> => {
  const reader = new FileReader();

  const fileContent = await new Promise<string>((resolve, reject) => {
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        resolve(result);
      } else {
        reject(new Error('Is not a string'));
      }
    };
    reader.onerror = () => {
      reject(
        new Error(
          reader.error?.message ?? 'An error occurred while reading the file.'
        )
      );
    };
    reader.readAsText(file);
  });

  const compressedData = pako.deflate(fileContent, {
    to: 'uint8array',
  });
  const compressedFile = new File([compressedData], `${file.name}.zip`, {
    type: 'application/zip',
  });
  return compressedFile;
};

export function generateUid() {
  return Math.random().toString(36).substring(2, 21);
}

export const generateDataArray = () => {
  const dataArray = [];

  for (let i = 1; i <= 20; i++) {
    const dataObject = {
      address: `0x${Math.random().toString(16).slice(2, 42).toUpperCase()}`,
      poolCount: `${Math.floor(Math.random() * 1000000) + 10000}`,
      totalVolumeUSD: `${(Math.random() * 1e12).toFixed(18)}`,
      txCount: `${Math.floor(Math.random() * 1000000) + 100000}`,
    };
    dataArray.push(dataObject);
  }

  return dataArray;
};

export function convertChainId(chainId: ChainIdType) {
  switch (chainId) {
    case 'AELF':
      return 'aelf MainChain';
    case 'tDVV':
    case 'tDVW':
      return 'aelf dAppChain';
    default:
      return chainId;
  }
}

/**
 * amount display as role: preLen...endLen
 * @param str amount value
 * @param preLen preLen
 * @param endLen endLen
 * @returns amount value string
 */
export const getOmittedStr = (
  str: string,
  preLen?: number,
  endLen?: number
) => {
  if (!str || typeof str !== 'string') {
    return str;
  }
  if (typeof preLen !== 'number' || typeof endLen !== 'number') {
    return str;
  }
  if (str.length <= preLen + endLen) {
    return str;
  }
  if (preLen === 0 || endLen === 0) {
    return str;
  }
  return `${str.slice(0, preLen)}...${str.slice(-endLen)}`;
};

export function openWithBlank(url: string): void {
  const newWindow = window.open(url, '_blank');
  if (newWindow) {
    newWindow.opener = null;
  }
}

export function getOtherExploreLink(
  data: string,
  network: keyof typeof ExploreUrlType,
  type: 'transaction' | 'address'
): string {
  const prefix = ExploreUrlType[network] || 'https://explorer.aelf.io';
  switch (type) {
    case 'transaction': {
      if (network === 'TRX') {
        return `${prefix}/#/transaction/${data}`;
      }
      return `${prefix}/tx/${data}`;
    }
    case 'address':
    default: {
      if (network === 'TRX') {
        return `${prefix}/#/address/${data}`;
      }
      return `${prefix}/address/${data}`;
    }
  }
}

export function zeroFill(str: string | BN) {
  return isBN(str) ? str.toString(16, 64) : str.padStart(64, '0');
}

export function objectToQueryString(params: object) {
  return Object.entries(params)
    .filter(
      ([, value]) => value !== undefined && value !== null && value !== ''
    )
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join('&');
}

export const getRemainingDays = () => {
  const now = dayjs();
  const endOfMonth = now.endOf('month');
  const remainingDays = endOfMonth.diff(now, 'day');
  return remainingDays;
};

export const getQueryFee = (queryCount: number, monthlyUnitPrice: number) => {
  if (!queryCount || !monthlyUnitPrice) {
    return 0;
  }
  const queryCountBignumber = BigNumber(queryCount);
  const monthlyUnitPriceBignumber = BigNumber(monthlyUnitPrice);
  return queryCountBignumber
    .times(monthlyUnitPriceBignumber)
    .div(10000)
    .toNumber();
};
