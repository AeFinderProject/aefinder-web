'use client';

import {
  TWalletInfo,
  WalletTypeEnum,
} from '@aelf-web-login/wallet-adapter-base';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import { Button } from 'antd';
import { MessageInstance } from 'antd/es/message/interface';
import clsx from 'clsx';
import Image from 'next/image';
import { useCallback, useRef, useState } from 'react';

import { useAppSelector } from '@/store/hooks';

type ConnectWalletFirstProps = {
  readonly classNames?: string;
  readonly messageApi?: MessageInstance;
};

export default function ConnectWalletFirst({
  classNames,
  messageApi,
}: ConnectWalletFirstProps) {
  const {
    connectWallet,
    walletInfo,
    walletType,
    isConnected,
    disConnectWallet,
  } = useConnectWallet();

  const [isLoading, setIsLoading] = useState(false);
  const userInfo = useAppSelector((state) => state.common.userInfo);

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
        if (userInfo?.walletAddress !== res?.address) {
          console.log(
            'userInfo?.walletAddress !== res?.address',
            userInfo?.walletAddress,
            res?.address
          );
          messageApi?.open({
            type: 'warning',
            content: `Please use the same wallet address as the one you bind to sign in.`,
            duration: 8,
          });
          await disConnectWallet();
        }
        // eslint-disable-next-line
      } catch (error: any) {
        messageApi?.open({
          type: 'error',
          content: `${error?.message}` || 'connectWallet error',
        });
      } finally {
        setIsLoading(false);
      }
    }
    const currentAddress = res?.address || walletInfoRef.current?.address;
    if (currentAddress && currentAddress === userInfo?.walletAddress) {
      messageApi?.success('Connect wallet success');
    } else {
      messageApi?.error('Connect wallet failed');
    }
  }, [connectWallet, messageApi, disConnectWallet, userInfo?.walletAddress]);

  return (
    <Button
      className={clsx('m-w-[280px] h-[40px]', classNames)}
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
      Connect wallet
    </Button>
  );
}
