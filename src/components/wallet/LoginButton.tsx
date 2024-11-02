'use client';

import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import { Button, message } from 'antd';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { useGetWalletSignParams } from '@/components/wallet/getWalletSignParams';

import { queryWalletAuthLogin } from '@/api/apiUtils';

interface LogInButtonProps {
  readonly className?: string;
}

export default function LogInButton({ className }: LogInButtonProps) {
  const { connectWallet, walletInfo, isConnected } = useConnectWallet();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { getReqParams } = useGetWalletSignParams();

  const loginSuccessActive = useCallback(() => {
    messageApi.open({
      type: 'success',
      content: 'login success',
    });
    router.push('/dashboard');
  }, [router, messageApi]);

  const handleWalletLogin = useCallback(async () => {
    console.log('handleWalletLogin start');
    setLoading(true);
    try {
      const reqParams = await getReqParams();
      if (!reqParams) {
        messageApi.open({
          type: 'error',
          content: 'Login sign wallet error',
        });
      }
      if (reqParams?.address) {
        await queryWalletAuthLogin(reqParams);
        loginSuccessActive();
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  }, [messageApi, getReqParams, loginSuccessActive]);

  const connectWalletFirst = useCallback(async () => {
    if (!walletInfo || !isConnected) {
      await connectWallet();
    }
  }, [walletInfo, isConnected, connectWallet]);

  useEffect(() => {
    if (pathname === '/login' && walletInfo && isConnected) {
      handleWalletLogin();
    }
  }, [pathname, walletInfo, isConnected, handleWalletLogin]);

  return (
    <Button
      className={className}
      onClick={connectWalletFirst}
      type='primary'
      icon={
        <Image
          src='/assets/svg/wallet.svg'
          alt='wallet'
          width={20}
          height={20}
          className='relative top-[4px]'
        />
      }
      iconPosition='start'
      loading={loading}
    >
      {contextHolder}
      Connect wallet
    </Button>
  );
}
