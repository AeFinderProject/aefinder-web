'use client';

import { message } from 'antd';
import BigNumber from 'bignumber.js';
import BN, { isBN } from 'bn.js';
import clsx, { ClassValue } from 'clsx';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import pako from 'pako';
import { DependencyList, useCallback, useRef } from 'react';
import { twMerge } from 'tailwind-merge';

import { ChainIdType } from '@/types/appType';
import { ExploreUrlType } from '@/types/loginType';

dayjs.extend(utc);
dayjs.extend(duration);

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

export const ZERO = new BigNumber(0);
export const ONE = new BigNumber(1);

// eslint-disable-next-line
export const isEffectiveNumber = (v: any) => {
  const val = new BigNumber(v);
  return !val.isNaN() && !val.lte(0);
};

export function timesDecimals(
  a?: BigNumber.Value,
  decimals: string | number = 18
) {
  if (!a) return ZERO;
  const bigA = ZERO.plus(a);
  if (bigA.isNaN()) return ZERO;
  if (typeof decimals === 'string' && decimals.length > 10)
    return bigA.times(decimals);
  return bigA.times(`1e${decimals}`);
}
export function divDecimals(
  a?: BigNumber.Value,
  decimals: string | number = 18
) {
  if (!a) return ZERO;
  const bigA = ZERO.plus(a);
  if (bigA.isNaN()) return ZERO;
  if (typeof decimals === 'string' && decimals.length > 10)
    return bigA.div(decimals);
  return bigA.div(`1e${decimals}`);
}

export function divDecimalsStr(
  a?: BigNumber.Value,
  decimals: string | number = 8,
  defaultVal = '--'
) {
  const n = divDecimals(a, decimals);
  return isEffectiveNumber(n) ? n.toFormat() : defaultVal;
}

export function calcProductNumber(
  queryCount: number,
  feeCount: number,
  productQueryCount: number
) {
  if (!queryCount || !productQueryCount) {
    return 0;
  }

  const queryCountBignumber = BigNumber(queryCount);
  const feeCountBignumber = BigNumber(feeCount);
  const productQueryCountBignumber = BigNumber(productQueryCount);
  return queryCountBignumber
    .times(1000)
    .minus(feeCountBignumber)
    .dividedBy(productQueryCountBignumber);
}

export function calcTotalPrice(queryCount: number, price: number) {
  if (!queryCount || !price) {
    return 0;
  }

  const queryCountBignumber = BigNumber(queryCount);
  const priceBignumber = BigNumber(price);
  return queryCountBignumber.times(priceBignumber).toString();
}

export function calcDiv100(
  number1: number | string,
  number2: number | string
): number {
  // Helper function to extract number from string
  const extractNumericValue = (input: number | string): BigNumber => {
    if (typeof input === 'string') {
      // Extract numeric part from string
      const numericValue = parseFloat(input.replace(/[^0-9.]/g, ''));
      return new BigNumber(isNaN(numericValue) ? 0 : numericValue);
    }

    // If input is a number, directly convert it to BigNumber
    return new BigNumber(input);
  };

  // Extract numeric parts from inputs
  const number1Bignumber = extractNumericValue(number1);
  const number2Bignumber = extractNumericValue(number2);

  // Return 0 if number2 is 0 (to avoid division by 0)
  if (number2Bignumber.isZero()) {
    return 0;
  }

  // Perform division and calculate percentage
  return number1Bignumber.div(number2Bignumber).times(100).toNumber();
}

export function displayUnit(chargeType: number, type: number, unit: string) {
  if (chargeType === 1) {
    return unit;
  }
  if (chargeType === 0) {
    if (type === 0) {
      return unit;
    }
    if (type === 1) {
      return 'hr';
    }
    if (type === 2) {
      return 'GB-hour';
    }
  }
  return unit;
}

export function formatToTwoDecimals(input: string) {
  // Handle null or undefined input
  if (input == null) {
    return '--';
  }

  // Convert the input to a floating-point number
  const numericValue = parseFloat(input);

  // Check if the input is a valid number
  if (isNaN(numericValue)) {
    return '--';
  }

  // Return the number formatted to at most two decimal places
  return `${parseFloat(numericValue.toFixed(2))}`;
}

// eslint-disable-next-line
export function processValue(input: any) {
  // Handle null or undefined input
  if (input == null) {
    return '--';
  }

  // If input is a number, return it as a string with at most two decimal places
  if (typeof input === 'number') {
    return `${parseFloat(input.toFixed(2))}`; // Ensure at most two decimal places
  }

  // If input is a string
  if (typeof input === 'string') {
    // Trim whitespace
    input = input.trim();

    // If the string contains 'm'
    if (input.includes('m')) {
      // Extract numeric part, divide by 1000, and convert to a string with at most two decimal places
      const numericValue = parseFloat(input.replace('m', ''));

      // If numericValue is valid, process it; if not, return '--'
      return isNaN(numericValue)
        ? '--'
        : `${parseFloat((numericValue / 1000).toFixed(2))}`;
    }

    // If the string does not contain 'm', try to convert to a number
    const numericValue = parseFloat(input);
    return isNaN(numericValue)
      ? '--'
      : `${parseFloat(numericValue.toFixed(2))}`;
  }

  // For other types, return '--'
  return '--';
}

// eslint-disable-next-line
export function bytesToGiB(memoryUsage: number | string) {
  // If input is null or undefined, return '--'
  if (memoryUsage == null) {
    return '--';
  }

  // If input is a string, convert it to a number
  const bytes =
    typeof memoryUsage === 'string' ? parseInt(memoryUsage, 10) : memoryUsage;

  // Check if the input is a valid number
  if (isNaN(bytes) || typeof bytes !== 'number') {
    return '--';
  }

  // Convert bytes to GiB
  const gibibytes = bytes / 1024 ** 3;

  // Format the result to two decimal places, remove unnecessary zeros, and add the unit
  return `${parseFloat(gibibytes.toFixed(2))} GiB`;
}

export function convertToGiB(input: string) {
  // If input is null or undefined, return '--'
  if (input == null) {
    return '--';
  }

  // If input is a string and contains 'Mi'
  if (typeof input === 'string' && input.includes('Mi')) {
    // Extract numeric part from string
    const numericValue = parseFloat(input.replace('Mi', '').trim());

    // Check if numericValue is a valid number
    if (isNaN(numericValue)) {
      return '--';
    }

    // Convert MiB to GiB by dividing by 1024
    const gibValue = numericValue / 1024;

    // Remove unnecessary trailing zeros from the result
    return `${parseFloat(gibValue.toFixed(2))} GiB`;
  }

  // For other cases (e.g., string without 'Mi'), return '--'
  return '--';
}

/**
 * Calculate time difference and return "X day Y hour" format.
 * @param {string} endTime - The UTC end time in ISO format.
 * @returns {string} - The time difference in "X day Y hour" format.
 */
export function calculateTimeDifference(endTime: string) {
  // Parse the end time as UTC
  const endDate = dayjs.utc(endTime);

  // Get the current time in UTC
  const now = dayjs.utc();

  // Calculate the total difference in milliseconds
  const diffInMilliseconds = endDate.diff(now);

  if (diffInMilliseconds <= 0) {
    return '0 day 0 hour'; // If already past, return 0
  }

  // Convert the time difference into a duration
  const duration = dayjs.duration(diffInMilliseconds);

  // Extract days and hours from the duration
  const days = Math.floor(duration.asDays()); // Total days without decimal
  const hours = duration.hours(); // Remaining hours beyond complete days

  // Format the result as "X day Y hour"
  return `${days} day ${hours} hour`;
}
