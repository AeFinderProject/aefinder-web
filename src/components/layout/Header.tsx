import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useCallback, useState } from 'react';

import PrimaryLink from '@/components/links/PrimaryLink';

import { useAppSelector } from '@/store/hooks';

export default function Header() {
  const router = useRouter();
  const [isShowBox, setIsShowBox] = useState(false);
  const { pathname } = router;
  const username = useAppSelector((state) => state.common.username);

  const handleLogout = useCallback(() => {
    router.push('/login');
  }, [router]);

  return (
    <header className='border-gray-E0 flex h-[72px] w-full items-center justify-between border-b px-[40px] py-[24px]'>
      <Image src='/svg/aefinder-logo.svg' alt='logo' width={150} height={30} />
      {pathname !== '/login' && (
        <div>
          <PrimaryLink className='mr-[40px]' href='/dashboard'>
            My Dashboard
          </PrimaryLink>
          {/* <UnstyledLink
            href='https://hoopox.feishu.cn/wiki/UDSiwf6s6iHTQ9k4ZbWcvEaGn0e'
            className='mx-[40px]'
          >
            Docs
          </UnstyledLink> */}
          <div
            className='w-25 border-gray-E0 relative inline-block min-h-10 cursor-pointer rounded border px-[20px] leading-[40px]'
            onClick={() => setIsShowBox(!isShowBox)}
          >
            <Image
              src='/svg/user.svg'
              alt='user'
              width={18}
              height={18}
              className='mr-2 inline-block'
            />
            {username}
            {isShowBox && (
              <div
                className='border-t-none border-gray-E0 hover:bg-gray-F5 hover:text-blue-click absolute left-0 top-11 h-10 w-full rounded border bg-white text-center'
                onClick={() => handleLogout()}
              >
                Logout
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
