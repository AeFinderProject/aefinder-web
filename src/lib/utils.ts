import { message } from 'antd';
import clsx, { ClassValue } from 'clsx';
import { DependencyList, useCallback, useRef } from 'react';
import { twMerge } from 'tailwind-merge';

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
