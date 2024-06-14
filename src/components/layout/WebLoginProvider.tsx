import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import { useCallback, useEffect } from 'react';

import { useAppDispatch } from '@/store/hooks';
import { setUsername } from '@/store/slices/commonSlice';

import { queryAuthToken } from '@/api/apiUtils';

export default function LoginProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const queryAuth = useCallback(async () => {
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
