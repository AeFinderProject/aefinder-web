import { DownOutlined, UpOutlined } from '@ant-design/icons';
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
            className='border-gray-E0 relative inline-block min-h-10 w-[154px] cursor-pointer rounded border px-[20px] leading-[40px]'
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
            {isShowBox ? (
              <UpOutlined className='ml-[6px]' />
            ) : (
              <DownOutlined className='ml-[6px]' />
            )}
            {isShowBox && (
              <div className='h-13 border-gray-E0 absolute left-0 top-[52px] w-full rounded border bg-white p-1 text-center'>
                <UpOutlined className='border-b-none text-gray-E0 absolute left-[68px] top-[-10px] bg-white text-xs' />
                <div
                  className='hover:bg-gray-F5 border-none text-center'
                  onClick={() => handleLogout()}
                >
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
