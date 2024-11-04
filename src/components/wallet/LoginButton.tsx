'use client';

import {
  TWalletInfo,
  WalletTypeEnum,
} from '@aelf-web-login/wallet-adapter-base';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import { Button, message } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useRef, useState } from 'react';

import { useGetWalletSignParams } from '@/components/wallet/getWalletSignParams';

import { queryWalletAuthLogin } from '@/api/apiUtils';

interface LogInButtonProps {
  readonly className?: string;
}

let retry = 50;

export default function LogInButton({ className }: LogInButtonProps) {
  const { getReqParams } = useGetWalletSignParams();
  const { connectWallet, walletInfo, walletType, isConnected } =
    useConnectWallet();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const walletInfoRef = useRef<TWalletInfo>();
  walletInfoRef.current = walletInfo;
  const walletTypeRef = useRef<WalletTypeEnum>();
  walletTypeRef.current = walletType;
  const isConnectedRef = useRef<boolean>();
  isConnectedRef.current = isConnected;

  const loginSuccessActive = useCallback(() => {
    messageApi.open({
      type: 'success',
      content: 'login success',
    });
    router.push('/dashboard');
  }, [router, messageApi]);

  const handleWalletLogin = useCallback(async () => {
    console.log('handleWalletLogin start');
    // wait for wallet connect complete and can get walletInfo data
    if (
      !walletInfoRef.current ||
      !walletTypeRef.current ||
      !isConnectedRef.current
    ) {
      setTimeout(() => {
        if (retry <= 0) return;
        retry--;
        handleWalletLogin();
      }, 100);
      return;
    }
    setLoading(true);
    try {
      const reqParams = await getReqParams({
        walletInfoRef: walletInfoRef.current,
        walletTypeRef: walletTypeRef.current,
        isConnectedRef: isConnectedRef.current,
      });

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
    let res;
    if (
      !walletInfoRef.current ||
      !walletTypeRef.current ||
      !isConnectedRef.current
    ) {
      try {
        res = await connectWallet();
        // eslint-disable-next-line
      } catch (error: any) {
        messageApi.open({
          type: 'error',
          content: `${error?.message}` || 'connectWallet error',
        });
      }
    }
    if (res?.address || walletInfoRef.current?.address) handleWalletLogin();
  }, [connectWallet, handleWalletLogin, messageApi]);

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
