'use client';

import {
  TWalletInfo,
  WalletTypeEnum,
} from '@aelf-web-login/wallet-adapter-base';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import { Button, message } from 'antd';
import Image from 'next/image';
import { useCallback, useRef, useState } from 'react';

export default function ConnectWalletFirst() {
  const { connectWallet, walletInfo, walletType, isConnected } =
    useConnectWallet();
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoading, setIsLoading] = useState(false);

  const walletInfoRef = useRef<TWalletInfo>();
  walletInfoRef.current = walletInfo;
  const walletTypeRef = useRef<WalletTypeEnum>();
  walletTypeRef.current = walletType;
  const isConnectedRef = useRef<boolean>();
  isConnectedRef.current = isConnected;

  const connectWalletFirst = useCallback(async () => {
    let res;
    if (
      !walletInfoRef.current ||
      !walletTypeRef.current ||
      !isConnectedRef.current
    ) {
      try {
        setIsLoading(true);
        res = await connectWallet();
        // eslint-disable-next-line
      } catch (error: any) {
        messageApi.open({
          type: 'error',
          content: `${error?.message}` || 'connectWallet error',
        });
      } finally {
        setIsLoading(false);
      }
    }
    const currentAddress = res?.address || walletInfoRef.current?.address;
    if (currentAddress) {
      messageApi.success('Connect wallet success');
    } else {
      messageApi.error('Connect wallet failed');
    }
  }, [connectWallet, messageApi]);

  return (
    <Button
      className='h-[40px] w-[280px]'
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
      loading={isLoading}
      onClick={() => connectWalletFirst()}
    >
      {contextHolder}
      Connect wallet
    </Button>
  );
}
