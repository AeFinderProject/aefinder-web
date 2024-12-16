'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useCallback, useEffect } from 'react';

import { useAppDispatch } from '@/store/hooks';
import { setUsername } from '@/store/slices/commonSlice';

import { queryAuthToken } from '@/api/apiUtils';

export default function LoginProvider({
  children,
}: {
  readonly children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const queryAuth = useCallback(async () => {
    // if home page, do not queryAuth
    if (pathname === '/' || pathname?.startsWith('/login')) {
      return;
    }

    const res = await queryAuthToken();
    if (res.auth === 'NoAuthToken') {
      router.push(`/login`);
    } else if (res.username) {
      dispatch(setUsername(res.username));
    }
  }, [router, pathname, dispatch]);

  useEffect(() => {
    queryAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
}
