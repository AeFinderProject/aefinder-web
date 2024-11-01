'use client';

import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import { Button, message } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

import { useGetWalletSignParams } from '@/components/wallet/getWalletSignParams';

import { queryWalletAuthLogin } from '@/api/apiUtils';

interface LogInButtonProps {
  className?: string;
}

export default function LogInButton({ className }: LogInButtonProps) {
  const { disConnectWallet } = useConnectWallet();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { getReqParams } = useGetWalletSignParams();

  const loginSuccessActive = useCallback(() => {
    messageApi.open({
      type: 'success',
      content: 'login success',
    });
    router.push('/dashboard');
  }, [router, messageApi]);

  const handleWalletLogin = useCallback(async () => {
    setLoading(true);
    try {
      const reqParams = await getReqParams();
      if (!reqParams) {
        messageApi.open({
          type: 'error',
          content: 'Login sign wallet error',
        });
      }
      if (reqParams && reqParams?.address) {
        await queryWalletAuthLogin(reqParams);
        loginSuccessActive();
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('error', error);
      await disConnectWallet;
    } finally {
      setLoading(false);
    }
  }, [messageApi, disConnectWallet, getReqParams, loginSuccessActive]);

  return (
    <Button
      className={className}
      onClick={handleWalletLogin}
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
