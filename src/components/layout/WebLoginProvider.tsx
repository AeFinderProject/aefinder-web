import { useRouter } from 'next/router';
import { ReactNode, useCallback, useEffect } from 'react';

import { useAppDispatch } from '@/store/hooks';
import { setUsername } from '@/store/slices/commonSlice';

import { queryAuthToken } from '@/api/apiUtils';

export default function LoginProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const queryAuth = useCallback(async () => {
    // if home page, do not queryAuth
    if (router?.pathname === '/') {
      return;
    }

    const res = await queryAuthToken();
    if (res.auth === 'NoAuthToken') {
      router.push(`/login`);
    } else {
      dispatch(setUsername(res.username));
    }
  }, [router, dispatch]);

  useEffect(() => {
    queryAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
}
