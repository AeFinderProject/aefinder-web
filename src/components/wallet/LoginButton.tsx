'use client';

import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import { Button, message } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import { useGetWalletSignParams } from '@/components/wallet/getWalletSignParams';

import { queryWalletAuthLogin } from '@/api/apiUtils';

interface LogInButtonProps {
  className?: string;
}

export default function LogInButton({ className }: LogInButtonProps) {
  const { connectWallet, disConnectWallet, isConnected } = useConnectWallet();
  const [messageApi, contextHolder] = message.useMessage();
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
    if (!isConnected) {
      await connectWallet();
    } else {
      const reqParams = await getReqParams();
      if (reqParams && reqParams?.address) {
        await queryWalletAuthLogin(reqParams);
        loginSuccessActive();
      } else {
        await disConnectWallet;
      }
    }
  }, [
    isConnected,
    connectWallet,
    disConnectWallet,
    getReqParams,
    loginSuccessActive,
  ]);

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
    >
      {contextHolder}
      Connect wallet
    </Button>
  );
}
