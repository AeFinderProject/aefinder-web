'use client';

import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import { DownOutlined, LoadingOutlined, UpOutlined } from '@ant-design/icons';
import { message } from 'antd';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';

import { openWithBlank, useThrottleCallback } from '@/lib/utils';

import Copy from '@/components/Copy';
import PrimaryLink from '@/components/links/PrimaryLink';
import UnstyledLink from '@/components/links/UnstyledLink';
import Bindwallet from '@/components/wallet/BindWallet';
import LogInButton from '@/components/wallet/LoginButton';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setApikeySummary } from '@/store/slices/appSlice';
import {
  setOrgUser,
  setUserInfo,
  setUsername,
} from '@/store/slices/commonSlice';

import { queryAuthToken } from '@/api/apiUtils';
import { getSummary } from '@/api/requestAPIKeys';
import { getUsersInfo } from '@/api/requestApp';
import { getUserAll } from '@/api/requestMarket';
import { CHAIN_ID } from '@/constant';

export default function Header() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [isShowBox, setIsShowBox] = useState(false);
  const { username } = useAppSelector((state) => state.common);
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const isLoginPathname = pathname?.startsWith('/login');
  const [messageApi, contextHolder] = message.useMessage();

  const { walletInfo, isConnected, disConnectWallet } = useConnectWallet();

  const getUsersInfoTemp = useThrottleCallback(async () => {
    await queryAuthToken();
    const res = await getUsersInfo();
    console.log('userInfo', res);

    dispatch(setUsername(res?.userName));
    dispatch(setUserInfo(res));

    if (res?.walletAddress) {
      setAddress(res?.walletAddress);
    } else if (!res?.walletAddress) {
      router.push('/login/bindwallet');
    }
  }, [dispatch, router, messageApi]);

  const getSummaryTemp = useThrottleCallback(async () => {
    const res = await getSummary();
    console.log('getSummaryTemp res', res);
    dispatch(setApikeySummary(res));
  }, [dispatch]);

  const getUserAllTemp = useThrottleCallback(async () => {
    const res = await getUserAll();
    console.log('getUserAll', res);
    dispatch(setOrgUser(res[0]));
  }, [dispatch]);

  useEffect(() => {
    if (pathname !== '/' && !isLoginPathname) {
      getUsersInfoTemp();
      getSummaryTemp();
      getUserAllTemp();
    }
  }, [
    getUsersInfoTemp,
    getSummaryTemp,
    getUserAllTemp,
    pathname,
    isLoginPathname,
  ]);

  useEffect(() => {
    const logoutContainer = document?.getElementById('logout-container');
    const listen = function (event: Event) {
      const node = event?.target;
      if (node instanceof Node && !logoutContainer?.contains(node)) {
        setIsShowBox(false);
      }
    };
    document?.addEventListener('click', listen);
    return () => {
      document?.removeEventListener('click', listen);
    };
  }, []);

  const handleLogout = useCallback(async () => {
    if (isConnected) {
      await disConnectWallet();
    }
    setAddress('');
    router.push('/login');
  }, [router, isConnected, disConnectWallet]);

  const handleResetPassword = useCallback(() => {
    router.push('/reset-password');
  }, [router]);

  const handleLinkToHome = useCallback(() => {
    router.replace('/');
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }, [router]);

  return (
    <header className='border-gray-E0 m-h-[72px] flex w-full items-center justify-between border-b px-[16px] py-[24px] sm:px-[40px] lg:h-[72px]'>
      {contextHolder}
      <Image
        src='/assets/svg/aefinder-logo.svg'
        alt='logo'
        width={150}
        height={24}
        onClick={handleLinkToHome}
        className='mb:mr-[0px] mr-[30px] cursor-pointer'
        style={{ width: '150px', height: '24px' }}
      />
      {isLoginPathname && (
        <div>
          <LogInButton className='mx-auto h-[40px] w-[160px] md:w-[170px]' />
        </div>
      )}
      {!isLoginPathname && pathname !== '/' && (
        <div>
          <Link
            href='/dashboard'
            className={clsx(
              'hidden sm:inline-block',
              pathname === '/dashboard'
                ? 'text-blue-link'
                : 'text-dark-primaryText'
            )}
          >
            My Dashboard
          </Link>
          <Link
            href='/dashboard/billing'
            className={clsx(
              'ml-[40px] hidden sm:inline-block',
              pathname?.startsWith('/dashboard/billing')
                ? 'text-blue-link'
                : 'text-dark-primaryText'
            )}
          >
            Billing
          </Link>
          <Link
            href='/dashboard/apikey'
            className={clsx(
              'ml-[40px] hidden sm:inline-block',
              pathname?.startsWith('/dashboard/apikey')
                ? 'text-blue-link'
                : 'text-dark-primaryText'
            )}
          >
            API Keys
          </Link>
          <Link
            href='https://docs.aefinder.io'
            className='text-dark-primaryText mx-[40px] hidden sm:inline-block'
          >
            Docs
          </Link>
          <div
            className='border-gray-E0 mb:my-[0px] relative my-[10px] inline-block min-h-10 min-w-[180px] cursor-pointer rounded border pl-[20px] pr-[30px] text-center leading-[40px] sm:min-w-[240px]'
            onClick={() => {
              setTimeout(() => {
                setIsShowBox(!isShowBox);
              }, 100);
            }}
          >
            <Image
              src='/assets/svg/user.svg'
              alt='user'
              width={18}
              height={18}
              className='mr-2 inline-block'
            />
            {username}
            {isLoading && <LoadingOutlined className='ml-[10px] text-lg' />}
            {isShowBox ? (
              <UpOutlined className='text-gray-80 absolute right-[6px] top-[13px]' />
            ) : (
              <DownOutlined className='text-gray-80 absolute right-[6px] top-[13px]' />
            )}
            <div
              id='logout-container'
              className={clsx(
                'h-13 border-gray-F0 fixed left-0 top-[71px] z-10 w-full border-b border-t bg-white bg-opacity-100 p-1 sm:absolute sm:top-[46px] sm:min-w-[144px] sm:rounded sm:border',
                !isShowBox && 'hidden'
              )}
            >
              <PrimaryLink
                href='/dashboard'
                className='hover:bg-gray-F5 w-full border-none px-[16px] sm:hidden'
              >
                My Dashboard
              </PrimaryLink>
              <PrimaryLink
                href='/dashboard/billing'
                className='hover:bg-gray-F5 w-full border-none px-[16px] sm:hidden'
              >
                Billing
              </PrimaryLink>
              <PrimaryLink
                href='/dashboard/apikey'
                className='hover:bg-gray-F5 w-full border-none px-[16px] sm:hidden'
              >
                API Keys
              </PrimaryLink>
              <div className='hover:bg-gray-F5 border-gray-F0 w-full border-b border-t px-[16px] text-left sm:hidden'>
                <UnstyledLink
                  href='https://docs.aefinder.io'
                  className='test-left block w-full'
                >
                  Docs
                </UnstyledLink>
              </div>
              <div>
                {!address && (
                  <Bindwallet
                    setIsLoading={setIsLoading}
                    setAddress={setAddress}
                  >
                    <div className='hover:bg-gray-F5 text-nowrap border-none pl-[10px] pr-[16px] text-left'>
                      <Image
                        src='/assets/svg/wallet-black.svg'
                        alt='wallet-black'
                        width={24}
                        height={24}
                        className='mr-2 inline-block align-middle'
                      />
                      Bind sign in wallet
                    </div>
                  </Bindwallet>
                )}
                {address && (
                  <div
                    className='hover:bg-gray-F5 hover:text-blue-link text-nowrap border-none pl-[10px] pr-[16px] text-left'
                    onClick={() => {
                      openWithBlank(
                        `https://testnet.aelfscan.io/${CHAIN_ID}/address/${address}`
                      );
                    }}
                  >
                    <Image
                      src='/assets/svg/address.svg'
                      alt='address'
                      width={24}
                      height={24}
                      className='mr-2 inline-block align-middle'
                    />
                    <Copy
                      textClassName='text-[14px] font-normal'
                      content={`ELF_${
                        address || walletInfo?.address || ''
                      }_${CHAIN_ID}`}
                      isShowCopy={true}
                      showLittle={true}
                    />
                  </div>
                )}
                <div
                  className='hover:bg-gray-F5 text-nowrap border-none pl-[10px] pr-[16px] text-left text-[14px]'
                  onClick={() => handleResetPassword()}
                >
                  <Image
                    src='/assets/svg/reset.svg'
                    alt='reset-password'
                    width={24}
                    height={24}
                    className='mr-2 inline-block align-middle'
                  />
                  Reset password
                </div>
                <div
                  className='hover:bg-gray-F5 border-none pl-[10px] pr-[16px] text-left text-[14px]'
                  onClick={() => handleLogout()}
                >
                  <Image
                    src='/assets/svg/logout.svg'
                    alt='logout'
                    width={24}
                    height={24}
                    className='mr-2 inline-block align-middle'
                  />
                  Logout
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
