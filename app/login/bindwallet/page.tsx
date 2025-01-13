'use client';

import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import { Button } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

import Bindwallet from '@/components/wallet/BindWallet';
export default function BindWallet() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const { isConnected, disConnectWallet } = useConnectWallet();

  const handleReturn = useCallback(() => {
    if (isConnected) {
      disConnectWallet();
      return;
    }
    router.push('/login');
  }, [isConnected, router, disConnectWallet]);

  return (
    <div className='flex w-full flex-col items-center justify-center pb-10 text-center'>
      <Image
        src='/assets/svg/login-logo.svg'
        alt='logo'
        width={240}
        height={240}
        className='mt-[48px] sm:h-[320px] sm:w-[320px]'
      />
      <div className='text-dark-normal mb-[24px] mt-[32px] text-xl font-medium'>
        Connect your wallet to get started
      </div>
      <Bindwallet
        setIsLoading={setIsLoading}
        callback={() => router.push('/dashboard')}
      >
        <Button
          className='mx-auto h-[40px] w-[280px]'
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
        >
          Connect wallet
        </Button>
      </Bindwallet>
      <div
        className='text-gray-80 mt-[14px] text-center text-xs'
        onClick={handleReturn}
      >
        Connect your wallet failed?
        <span className='text-blue-link ml-[8px] cursor-pointer text-xs'>
          {' '}
          please use another account
        </span>
      </div>
    </div>
  );
}
