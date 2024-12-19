'use client';

import { TWalletInfo } from '@aelf-web-login/wallet-adapter-base';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import { ExclamationCircleOutlined, LeftOutlined } from '@ant-design/icons';
import type { SliderSingleProps } from 'antd';
import { Button, Col, Divider, message, Row, Slider, Tag } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import {
  calcProductNumber,
  divDecimalsStr,
  getOmittedStr,
  getQueryFee,
  handleErrorMessage,
  timesDecimals,
  useDebounceCallback,
  useThrottleCallback,
} from '@/lib/utils';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setFreeApiQueryCount, setOrgUserAll } from '@/store/slices/appSlice';
import {
  setElfBalance,
  setOrgBalance,
  setUsdtBalance,
} from '@/store/slices/commonSlice';

import {
  createOrder,
  getApiQueryCountFree,
  getOrgBalance,
  getOrgUserAll,
} from '@/api/requestMarket';
import {
  AeFinderContractAddress,
  CHAIN_ID,
  tokenContractAddress,
} from '@/constant';

import { ApproveResponseType, GetBalanceResponseType } from '@/types/appType';

const marks: SliderSingleProps['marks'] = {
  100: {
    style: {
      fontSize: '12px',
      color: '#808080',
    },
    label: <strong>100K</strong>,
  },
  300: {
    style: {
      fontSize: '12px',
      color: '#808080',
    },
    label: <strong>300K</strong>,
  },
  500: {
    style: {
      fontSize: '12px',
      color: '#808080',
    },
    label: <strong>500K</strong>,
  },
};

export default function Upgrade() {
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

  const walletInfoRef = useRef<TWalletInfo>();
  walletInfoRef.current = walletInfo;
  const isConnectedRef = useRef<boolean>();
  isConnectedRef.current = isConnected;

  const [loading, setLoading] = useState(false);
  const [currentQueryCount, setCurrentQueryCount] = useState(100);
  const [currentMonth, setCurrentMonth] = useState<1 | 3 | 6>(1);
  const [currentAmount, setCurrentAmount] = useState<number>(0);
  const [currentTotalAmount, setCurrentTotalAmount] = useState<number>(0);

  const userInfo = useAppSelector((state) => state.common.userInfo);
  const usdtBalance = useAppSelector((state) => state.common.usdtBalance);
  const elfBalance = useAppSelector((state) => state.common.elfBalance);
  const orgBalance = useAppSelector((state) => state.common.orgBalance);
  const orgUserAll = useAppSelector((state) => state.app.orgUserAll);
  const regularData = useAppSelector((state) => state.app.regularData);
  const freeApiQueryCount = useAppSelector(
    (state) => state.app.freeApiQueryCount
  );

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

  const getOrgBalanceTemp = useDebounceCallback(
    async (organizationId) => {
      console.log('getOrgBalanceTemp', organizationId);
      if (!organizationId) {
        return;
      }
      const getOrgBalanceRes = await getOrgBalance({
        organizationId: organizationId,
      });
      console.log('getOrgBalance', getOrgBalanceRes);
      if (getOrgBalanceRes?.balance) {
        dispatch(setOrgBalance(getOrgBalanceRes));
      }
    },
    [getOrgBalance]
  );

  const getApiQueryCountFreeTemp = useDebounceCallback(
    async (organizationId) => {
      if (!organizationId) {
        return;
      }
      const res = await getApiQueryCountFree({
        organizationId: organizationId,
      });
      if (res) {
        dispatch(setFreeApiQueryCount(res));
      }
    },
    [getApiQueryCountFree]
  );

  const getOrgUserAllTemp = useDebounceCallback(async () => {
    const res = await getOrgUserAll();
    console.log('getOrgUserAllTemp', res);
    if (res.length > 0) {
      dispatch(setOrgUserAll(res[0]));
      const organizationId = res[0]?.id;
      getOrgBalanceTemp(organizationId);
      getApiQueryCountFreeTemp(organizationId);
    }
  }, [dispatch, getOrgBalanceTemp, getApiQueryCountFreeTemp]);

  useEffect(() => {
    getOrgUserAllTemp();
  }, [getOrgUserAllTemp, orgUserAll]);

  useEffect(() => {
    let tempAmount = 0;
    if (currentQueryCount <= 100) {
      tempAmount = 0;
    } else {
      console.log('freeApiQueryCount', freeApiQueryCount);
      console.log(
        'currentQueryCount',
        currentQueryCount * 1000 - freeApiQueryCount
      );
      console.log('monthlyUnitPrice', regularData?.monthlyUnitPrice);
      tempAmount = getQueryFee(
        currentQueryCount * 1000 - freeApiQueryCount,
        regularData?.monthlyUnitPrice
      );
      console.log('tempAmount', tempAmount);
    }
    setCurrentAmount(tempAmount);
  }, [currentQueryCount, regularData?.monthlyUnitPrice, freeApiQueryCount]);

  useEffect(() => {
    setCurrentTotalAmount(currentAmount * currentMonth);
  }, [currentAmount, currentMonth]);

  const handlePreCreateOrder = useCallback(async () => {
    const createOrderRes = await createOrder({
      organizationId: orgUserAll?.id,
      productId: regularData?.productId,
      productNumber: Number(
        calcProductNumber(
          currentQueryCount,
          freeApiQueryCount,
          Number(regularData?.queryCount)
        )
      ),
      periodMonths: currentMonth,
    });
    if (createOrderRes?.length > 0) {
      const { billingId, billingAmount } = createOrderRes[0];
      return {
        billingId,
        billingAmount,
      };
    } else {
      return {
        billingId: '',
        billingAmount: 0,
      };
    }
  }, [
    currentQueryCount,
    currentMonth,
    orgUserAll?.id,
    regularData?.productId,
    regularData?.queryCount,
    freeApiQueryCount,
  ]);

  const handleCreateOrder = useDebounceCallback(async () => {
    setLoading(true);
    try {
      const { billingId, billingAmount } = await handlePreCreateOrder();
      console.log('billingId, billingAmount', billingId, billingAmount);
      if (!billingId || !billingAmount) {
        messageApi.warning('Create order failed');
        return;
      }
      const approveResult: ApproveResponseType = await callSendMethod({
        contractAddress: tokenContractAddress,
        methodName: 'Approve',
        args: {
          spender: AeFinderContractAddress,
          symbol: 'USDT',
          amount: timesDecimals(billingAmount, 6),
        },
        chainId: CHAIN_ID,
      });
      if (approveResult?.data?.Status === 'MINED') {
        messageApi.open({
          type: 'success',
          content:
            'Approve successfully, please continue to Confirm monthly purchase',
        });
        const lockResult: ApproveResponseType = await callSendMethod({
          contractAddress: AeFinderContractAddress,
          methodName: 'Lock',
          args: {
            symbol: 'USDT',
            amount: timesDecimals(billingAmount, 6),
            billingId: billingId,
          },
          chainId: 'tDVV',
        });
        if (lockResult?.data?.Status === 'MINED') {
          messageApi.open({
            type: 'success',
            content:
              'Confirm monthly purchase successfully, please wait for the purchase locked to start',
            duration: 20,
          });
          // refresh balance when Confirm monthly purchase success
          getBalance();
          getOrgBalanceTemp();
        } else {
          messageApi.open({
            type: 'error',
            content: 'Confirm monthly purchase failed',
          });
        }
        console.log('lockResult', lockResult);
      }
    } finally {
      setLoading(false);
    }
  }, [currentMonth]);

  return (
    <div className='px-[16px] pb-[36px] sm:px-[40px]'>
      {contextHolder}
      <div className='border-gray-F0 flex h-[120px] flex-col items-start justify-center border-b'>
        <div>
          <LeftOutlined
            className='relative top-[-7px] mr-[16px] cursor-pointer align-middle text-sm'
            onClick={() => router.back()}
          />
          <span className='text-3xl text-black'>Upgrade Plan</span>
        </div>
      </div>
      <div className='mt-[24px]'>
        <Row gutter={24}>
          <Col span={14}>
            <div className='mb-[28px] flex items-center justify-between'>
              <div className='text-xl font-medium text-black'>
                <Image
                  src='/assets/svg/step1.svg'
                  alt='step1'
                  width={24}
                  height={24}
                  className='relative top-[-2px] mr-[16px] inline-block align-middle'
                />
                Estimated number of monthly queries
              </div>
              <div>
                <span className='text-dark-normal'>500,000</span>
                <span className='text-blue-link ml-[16px] cursor-pointer'>
                  Max
                </span>
              </div>
            </div>
            <Slider
              value={currentQueryCount}
              min={100}
              max={500}
              step={10}
              onChange={(value) => setCurrentQueryCount(value)}
              marks={marks}
            />
            <div className='text-gray-80 mt-[20px] text-sm'>
              *First 100,000 is free, subsequent queries are chargeable at
              $4/100,000 queries
            </div>
            <Divider className='my-[35px]' />
            <div className='mb-[28px] text-xl font-medium text-black'>
              <Image
                src='/assets/svg/step2.svg'
                alt='step2'
                width={24}
                height={24}
                className='relative top-[-2px] mr-[16px] inline-block align-middle'
              />
              Prepay for
            </div>
            <div>
              <Button
                type={currentMonth === 1 ? 'primary' : 'default'}
                onClick={() => setCurrentMonth(1)}
              >
                1 Month
              </Button>
              <Button
                type={currentMonth === 3 ? 'primary' : 'default'}
                onClick={() => setCurrentMonth(3)}
                className='mx-[10px]'
              >
                3 Month
              </Button>
              <Button
                type={currentMonth === 6 ? 'primary' : 'default'}
                onClick={() => setCurrentMonth(6)}
              >
                6 Month
              </Button>
            </div>
            <Divider className='my-[35px]' />
            <div className='mb-[28px] text-xl font-medium text-black'>
              <Image
                src='/assets/svg/step3.svg'
                alt='step3'
                width={24}
                height={24}
                className='relative top-[-2px] mr-[16px] inline-block align-middle'
              />
              Confirm wallet
            </div>
            <div className='mb-[20px]'>
              <span className='text-gray-80 mr-[16px]'>Pay with: </span>
              <Button>
                <Image
                  src='/assets/svg/user.svg'
                  alt='user'
                  width={18}
                  height={18}
                  className='hover:text-blue-link mr-3 inline-block'
                />
                <span>{getOmittedStr(userInfo.walletAddress, 8, 9)}</span>
              </Button>
            </div>
            <div className='flex items-start justify-start'>
              <span className='text-gray-80 mr-[16px] text-sm'>
                Wallet balance:
              </span>
              <div>
                <div className='text-dark-normal mr-[4px] text-sm'>
                  {divDecimalsStr(usdtBalance?.balance || 0, 6)} USDT
                </div>
                <div className='text-dark-normal text-sm'>
                  {divDecimalsStr(elfBalance?.balance || 0, 8)} ELF
                </div>
              </div>
            </div>
            <div className='my-[8px]'>
              <span className='text-gray-80 mr-[16px] text-sm'>
                Billing balance:
              </span>
              <span className='text-dark-normal mr-[2px] text-sm'>
                {orgBalance?.balance || '--'} USDT{' '}
              </span>
              <span className='text-gray-80 text-sm'>
                (Locked: {orgBalance?.lockedBalance || '--'} USDT)
              </span>
            </div>
            <Tag
              icon={
                <ExclamationCircleOutlined className='relative top-[-3px]' />
              }
              color='processing'
              className='my-[8px] h-[40px] w-full leading-10 '
            >
              <span className='text-gray-80 w-full overflow-hidden text-sm'>
                You will be able to withdraw your unlocked balance at any time
              </span>
            </Tag>
            {currentTotalAmount > orgBalance?.balance && (
              <Tag
                icon={
                  <ExclamationCircleOutlined className='relative top-[-3px]' />
                }
                color='warning'
                className='h-[40px] w-full leading-10'
              >
                <span className='text-gray-80 text-sm'>
                  You don’t have enough billing balance. Please
                  <span
                    className='text-blue-link mx-[4px] cursor-pointer text-sm'
                    onClick={() => router.push('/dashboard/billing/deposit')}
                  >
                    top up your balance
                  </span>
                  to proceed.
                </span>
              </Tag>
            )}
            <Divider className='my-[35px]' />
            <div className='align-center mb-[35px] flex justify-between'>
              <div>
                <div className='text-gray-80 text-sm'>Est. Monthly Cost*</div>
                <div className='text-dark-normal'>
                  {currentAmount} USDT/month
                </div>
              </div>
              {currentTotalAmount > orgBalance?.balance && (
                <Button type='default' disabled={true}>
                  Insufficient billing balance
                </Button>
              )}
              {currentTotalAmount <= orgBalance?.balance && (
                <Button
                  type='primary'
                  disabled={currentTotalAmount === 0}
                  onClick={handleCreateOrder}
                  loading={loading}
                >
                  Confirm monthly purchase
                </Button>
              )}
            </div>
            <div className='text-gray-80 text-sm'>
              * This amount will be locked in your Billing Balance and cannot be
              withdrawn. We will charge the exact amount consumed at the end of
              each month. Any unused funds in your Billing Balance will then be
              unlocked and available for withdrawal.
            </div>
          </Col>
          <Col span={9} offset={1}>
            <div className='text-xl font-medium text-black'>
              Your Plan Details
            </div>
            <div className='text-gray-80 my-[16px] text-sm'>
              Growth plan will also include 100K free monthly queries.
            </div>
            <div className='bg-gray-F5 rounded-lg p-[20px]'>
              <div className='mb-[20px] flex justify-between'>
                <div className='text-gray-80 text-sm'>Est. Queries</div>
                <div className='text-dark-normal'>{currentQueryCount}K</div>
              </div>
              <div className='flex justify-between'>
                <div className='text-gray-80 text-sm'>Months</div>
                <div className='text-dark-normal'>{currentMonth}</div>
              </div>
              <Divider />
              <div className='flex justify-between'>
                <div className='text-gray-80 text-sm'>Est. Monthly Cost</div>
                <div className='text-dark-normal'>
                  {regularData?.monthlyUnitPrice} USDT/month
                </div>
              </div>
              <Divider />
              <div className='flex justify-between'>
                <div className='text-dark-normal'>Est. Total Cost</div>
                <div className='text-dark-normal'>
                  {currentTotalAmount?.toFixed(2)} USDT
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
