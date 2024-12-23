'use client';

import { TWalletInfo } from '@aelf-web-login/wallet-adapter-base';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import { LeftOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Input, InputNumber, message, Row } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import {
  divDecimalsStr,
  getOmittedStr,
  handleErrorMessage,
  timesDecimals,
  useDebounceCallback,
  useThrottleCallback,
} from '@/lib/utils';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setOrgUserAll } from '@/store/slices/appSlice';
import {
  setElfBalance,
  setOrgBalance,
  setUsdtBalance,
} from '@/store/slices/commonSlice';

import { getOrgBalance, getOrgUserAll } from '@/api/requestMarket';
import {
  AeFinderContractAddress,
  CHAIN_ID,
  tokenContractAddress,
} from '@/constant';

import { ApproveResponseType, GetBalanceResponseType } from '@/types/appType';

export default function Withdraw() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const {
    callSendMethod,
    callViewMethod,
    getAccountByChainId,
    walletInfo,
    isConnected,
  } = useConnectWallet();
  const [loading, setLoading] = useState(false);
  const userInfo = useAppSelector((state) => state.common.userInfo);
  const usdtBalance = useAppSelector((state) => state.common.usdtBalance);
  const elfBalance = useAppSelector((state) => state.common.elfBalance);
  const orgBalance = useAppSelector((state) => state.common.orgBalance);
  const [withdrawAddress, setWithdrawAddress] = useState(
    userInfo?.walletAddress
  );
  const [currentAmount, setCurrentAmount] = useState<number | null>(null);

  const walletInfoRef = useRef<TWalletInfo>();
  walletInfoRef.current = walletInfo;
  const isConnectedRef = useRef<boolean>();
  isConnectedRef.current = isConnected;

  const getBalance = useThrottleCallback(async () => {
    if (!isConnectedRef.current || !walletInfoRef.current) {
      return;
    }
    try {
      const getELFBalance: GetBalanceResponseType = await callViewMethod({
        chainId: CHAIN_ID,
        contractAddress: tokenContractAddress,
        methodName: 'GetBalance',
        args: {
          symbol: 'ELF',
          owner: await getAccountByChainId(CHAIN_ID),
        },
      });
      console.log('getELFBalance', getELFBalance);
      dispatch(setElfBalance(getELFBalance?.data));
      const getUSDTBalance: GetBalanceResponseType = await callViewMethod({
        chainId: CHAIN_ID,
        contractAddress: tokenContractAddress,
        methodName: 'GetBalance',
        args: {
          symbol: 'USDT',
          owner: await getAccountByChainId(CHAIN_ID),
        },
      });
      console.log('getUSDTBalance', getUSDTBalance);
      dispatch(setUsdtBalance(getUSDTBalance?.data));
    } catch (error) {
      messageApi.error(handleErrorMessage(error));
    }
  }, [
    callViewMethod,
    dispatch,
    setElfBalance,
    setUsdtBalance,
    messageApi,
    isConnectedRef.current,
    walletInfoRef.current,
  ]);

  useEffect(() => {
    getBalance();
  }, [getBalance]);

  const getOrgBalanceTemp = useThrottleCallback(async () => {
    const getOrgBalanceRes = await getOrgBalance();
    console.log('getOrgBalance', getOrgBalanceRes);
    if (getOrgBalanceRes?.balance) {
      dispatch(setOrgBalance(getOrgBalanceRes));
    }
  }, [getOrgBalance]);

  const getOrgUserAllTemp = useThrottleCallback(async () => {
    const res = await getOrgUserAll();
    console.log('getOrgUserAllTemp', res);
    if (res.length > 0) {
      dispatch(setOrgUserAll(res[0]));
    }
  }, [dispatch]);

  useEffect(() => {
    getOrgUserAllTemp();
    getOrgBalanceTemp();
  }, [getOrgUserAllTemp, getOrgBalanceTemp]);

  const handleWithdraw = useDebounceCallback(async () => {
    if (!withdrawAddress) {
      messageApi.warning('Please input withdraw address');
      return;
    }
    if (!currentAmount || currentAmount <= 0) {
      messageApi.warning('Insufficient withdraw USDT balance');
      return;
    }
    if (currentAmount > orgBalance?.balance) {
      messageApi.warning('withdraw USDT balance is not enough');
      return;
    }
    try {
      setLoading(true);
      const withdrawResult: ApproveResponseType = await callSendMethod({
        contractAddress: AeFinderContractAddress,
        methodName: 'Withdraw',
        args: {
          symbol: 'USDT',
          amount: timesDecimals(currentAmount, 6),
          address: withdrawAddress,
        },
        chainId: 'tDVV',
      });
      if (withdrawResult?.data?.Status === 'MINED') {
        messageApi.open({
          type: 'success',
          content: 'withdraw successfully',
          duration: 3,
        });
        setCurrentAmount(null);
        await getBalance();
        await getOrgUserAllTemp();
        setTimeout(() => {
          router.back();
        }, 4000);
      } else {
        messageApi.open({
          type: 'error',
          content: 'withdraw failed',
        });
      }
      console.log('withdrawResult', withdrawResult);
    } catch (error) {
      messageApi.open({
        type: 'error',
        content: `withdraw failed: ${handleErrorMessage(error)}`,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className='px-[16px] pb-[40px] sm:px-[40px]'>
      {contextHolder}
      <div className='border-gray-F0 flex h-[120px] flex-col items-start justify-center border-b'>
        <div>
          <LeftOutlined
            className='relative top-[-7px] mr-[16px] cursor-pointer align-middle text-sm'
            onClick={() => router.back()}
          />
          <span className='text-3xl text-black'>Withdraw Assets</span>
        </div>
      </div>
      <Row gutter={24} className='mt-[24px]'>
        <Col span={14} offset={5}>
          <div className='text-xl font-medium text-black'>
            <Image
              src='/assets/svg/step1.svg'
              alt='step1'
              width={24}
              height={24}
              className='relative top-[-2px] mr-[16px] inline-block align-middle'
            />
            Wallet
          </div>
          <div className='mt-[20px]'>
            <span className='text-gray-80 mr-[20px]'>From </span>
            <Button
              icon={
                <Image
                  src='/assets/svg/user.svg'
                  alt='user'
                  width={18}
                  height={18}
                  className='relative top-[4px]'
                />
              }
            >
              <span>{getOmittedStr(userInfo.walletAddress, 8, 9)}</span>
            </Button>
            <div className='mt-[20px] flex items-start justify-start'>
              <span className='text-gray-80 mr-[20px]'>Wallet Balance:</span>
              <div>
                <div className='text-dark-normal font-medium'>
                  <span className='mr-[8px]'>
                    {divDecimalsStr(usdtBalance?.balance || 0, 6)}
                  </span>
                  <span>USDT</span>
                </div>
                <div className='text-dark-normal mt-[10px] font-medium'>
                  <span className='mr-[8px]'>
                    {divDecimalsStr(elfBalance?.balance || 0, 8)}
                  </span>
                  <span>ELF</span>
                </div>
              </div>
            </div>
            <div className='my-[8px]'>
              <span className='text-gray-80 mr-[20px]'>Billing balance:</span>
              <span className='text-dark-normal mr-[2px] font-medium'>
                {orgBalance?.balance || '--'} USDT{' '}
              </span>
              <span className='text-gray-80 font-medium'>
                (Locked: {orgBalance?.lockedBalance || '--'} USDT)
              </span>
            </div>
          </div>
          <div className='mb-[20px] mt-[40px] text-xl font-medium text-black'>
            <Image
              src='/assets/svg/step2.svg'
              alt='step2'
              width={24}
              height={24}
              className='relative top-[-2px] mr-[16px] inline-block align-middle'
            />
            Withdraw
          </div>
          <div className='border-gray-E0 rounded-lg border px-[12px] py-[18px]'>
            <div className='mb-[18px]'>
              <span className='text-gray-80'>Form</span>
              <Image
                src='/assets/svg/coin-icon/aelf-chain.svg'
                alt='aelf'
                width={24}
                height={24}
                className='relative top-[-2px] ml-[20px] mr-[4px] inline-block align-middle'
              />
              <span className='text-dark-normal font-medium'>
                aelf dAppChain
              </span>
            </div>
            <div>
              <Image
                src='/assets/svg/coin-icon/usdt-chain.svg'
                alt='usdt'
                width={24}
                height={24}
                className='relative top-[-4px] inline-block align-middle'
              />
              <span className='text-dark-normal mx-[8px] text-xl'>USDT</span>
              <span className='text-gray-80 text-sm'>Tether USD</span>
            </div>
          </div>
          <Divider className='my-[35px]' />
          <div className='mb-[20px] text-xl font-medium text-black'>
            <Image
              src='/assets/svg/step3.svg'
              alt='step3'
              width={24}
              height={24}
              className='relative top-[-2px] mr-[16px] inline-block align-middle'
            />
            Calculator
          </div>
          <div className='border-gray-E0 mb-[20px] rounded-lg border px-[12px] py-[18px]'>
            <div className='text-gray-80'>
              Withdrawal Address
              <span className='ml-[10px]'>(default wallet address)</span>
            </div>
            <Input
              placeholder='Enter an address'
              size='large'
              className='my-[18px] w-full rounded-lg'
              value={withdrawAddress}
              onChange={(e) => setWithdrawAddress(e.target.value)}
            />
          </div>
          <div className='border-gray-E0 mb-[35px] rounded-lg border px-[12px] py-[18px]'>
            <div className='text-gray-80'>Withdrawal Amount</div>
            <InputNumber
              className='my-[18px] w-full'
              addonAfter='USDT'
              size='large'
              value={currentAmount}
              onChange={(value) => setCurrentAmount(value as number)}
            />
            <div className='mb-[18px]'>
              <span className='text-gray-80 text-sm'>
                Estimated Transaction Fee:{' '}
              </span>
              <span className='text-dark-normal text-sm'>0.25885 ELF</span>
            </div>
          </div>
          <Button
            type='primary'
            className='w-full'
            size='large'
            onClick={handleWithdraw}
            loading={loading}
          >
            Withdraw
          </Button>
        </Col>
      </Row>
    </div>
  );
}
