'use client';

import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import { sleep } from '@portkey/utils';
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
  const { connectWallet, disConnectWallet, walletInfo } = useConnectWallet();
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
    if (!walletInfo) {
      await connectWallet();
      await sleep(1000);
    }
    try {
      const reqParams = await getReqParams();
      if (reqParams && reqParams?.address) {
        await queryWalletAuthLogin(reqParams);
        loginSuccessActive();
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('error', error);
      messageApi.open({
        type: 'error',
        content: 'wallet login with error',
      });
      await disConnectWallet;
    } finally {
      setLoading(false);
    }
  }, [
    walletInfo,
    messageApi,
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
      loading={loading}
    >
      {contextHolder}
      Connect wallet
    </Button>
  );
}
