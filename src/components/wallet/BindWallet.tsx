import {
  TWalletInfo,
  WalletTypeEnum,
} from '@aelf-web-login/wallet-adapter-base';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import { message } from 'antd';
import { useRouter } from 'next/navigation';
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { useGetWalletSignParams } from '@/components/wallet/getWalletSignParams';

import { bindWallet, getUsersInfo } from '@/api/requestApp';

interface BindwalletProps {
  readonly children: ReactNode;
  readonly setIsLoading?: Dispatch<SetStateAction<boolean>>;
  readonly setAddress?: Dispatch<SetStateAction<string>>;
  readonly callback?: () => void;
}

let retry = 50;

export default function Bindwallet({
  children,
  setIsLoading,
  setAddress,
  callback,
}: BindwalletProps) {
  const router = useRouter();

  const [isHaveAddress, setIsHaveAddress] = useState('');

  const {
    disConnectWallet,
    connectWallet,
    walletInfo,
    walletType,
    isConnected,
  } = useConnectWallet();
  const [messageApi, contextHolder] = message.useMessage();

  const { getReqParams } = useGetWalletSignParams();

  const walletInfoRef = useRef<TWalletInfo>();
  walletInfoRef.current = walletInfo;
  const walletTypeRef = useRef<WalletTypeEnum>();
  walletTypeRef.current = walletType;
  const isConnectedRef = useRef<boolean>();
  isConnectedRef.current = isConnected;

  const getUsersInfoTemp = useCallback(async () => {
    const res = await getUsersInfo();
    if (res?.walletAddress) {
      setIsHaveAddress(res?.walletAddress);
    }
  }, []);

  useEffect(() => {
    getUsersInfoTemp();
  }, [getUsersInfoTemp]);

  const handleBindSignInWallet = useCallback(async () => {
    // wait for wallet connect complete and can get walletInfo data
    if (
      !walletInfoRef.current ||
      !walletTypeRef.current ||
      !isConnectedRef.current
    ) {
      setTimeout(() => {
        if (retry <= 0) return;
        retry--;
        handleBindSignInWallet();
      }, 100);
      return;
    }

    setIsLoading && setIsLoading(true);
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
        const res = await bindWallet({
          timestamp: reqParams.timestamp,
          signatureVal: reqParams.signature ?? '',
          chainId: reqParams.chain_id,
          caHash: reqParams.ca_hash,
          publicKey: reqParams.publickey,
          address: reqParams.address,
        });
        if (res?.walletAddress) {
          if (setAddress) {
            setAddress(res?.walletAddress);
          }
          messageApi.open({
            type: 'success',
            content: 'Bind sign wallet success',
          });
          callback && callback();
        }
      }
    } catch (error) {
      console.log('error', error);
      if (isConnectedRef.current) {
        await disConnectWallet();
      }
    } finally {
      if (setIsLoading) {
        setIsLoading(false);
      }
    }
  }, [
    getReqParams,
    messageApi,
    disConnectWallet,
    callback,
    setAddress,
    setIsLoading,
  ]);

  const connectWalletFirst = useCallback(async () => {
    let res;
    if (!walletInfoRef.current || !walletTypeRef.current) {
      try {
        if (setIsLoading) {
          setIsLoading(true);
        }
        res = await connectWallet();
        // eslint-disable-next-line
      } catch (error: any) {
        messageApi.open({
          type: 'error',
          content: `${error?.message}` || 'connectWallet error',
        });
      } finally {
        if (setIsLoading) {
          setIsLoading(false);
        }
      }
    }

    if (res?.address || walletInfoRef.current?.address) {
      // if have bind wallet address, go to dashboard
      if (isHaveAddress) {
        router.push('/dashboard');
      } else {
        handleBindSignInWallet();
      }
    }
  }, [
    connectWallet,
    handleBindSignInWallet,
    messageApi,
    isHaveAddress,
    router,
    setIsLoading,
  ]);

  return (
    <div className='w-full' onClick={connectWalletFirst}>
      {contextHolder}
      {children}
    </div>
  );
}
