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
  divDecimalsStr,
  getOmittedStr,
  handleErrorMessage,
  timesDecimals,
  useDebounceCallback,
  useThrottleCallback,
} from '@/lib/utils';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setElfBalance,
  setOrgBalance,
  setUsdtBalance,
} from '@/store/slices/commonSlice';

import {
  cancelOrder,
  getAssetsList,
  getMerchandisesList,
  getOrgBalance,
  order,
  payOrder,
  watchOrdersCost,
} from '@/api/requestMarket';
import {
  AeFinderContractAddress,
  CHAIN_ID,
  tokenContractAddress,
} from '@/constant';

import { ApproveResponseType, GetBalanceResponseType } from '@/types/appType';
import { MerchandisesItem } from '@/types/marketType';

const marks: SliderSingleProps['marks'] = {
  100000: {
    style: {
      fontSize: '12px',
      color: '#808080',
    },
    label: <strong>100k</strong>,
  },
  50000000: {
    style: {
      fontSize: '12px',
      color: '#808080',
    },
    label: <strong>50,000k</strong>,
  },
  100000000: {
    style: {
      fontSize: '12px',
      color: '#808080',
    },
    label: <strong>100,000k</strong>,
  },
  150000000: {
    style: {
      fontSize: '12px',
      color: '#808080',
    },
    label: <strong>150,000k</strong>,
  },
  200000000: {
    style: {
      fontSize: '12px',
      color: '#808080',
    },
    label: <strong>200,000k</strong>,
  },
  250000000: {
    style: {
      fontSize: '12px',
      color: '#808080',
    },
    label: <strong>250,000k</strong>,
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
  const isMobile = window?.innerWidth < 640;

  const [loading, setLoading] = useState(false);
  const [freeQuantity, setFreeQuantity] = useState<number>(100000);
  const [currentQueryCount, setCurrentQueryCount] = useState(100000);
  const [currentAmount, setCurrentAmount] = useState<number>(0);
  const [currentDeductionAmount, setCurrentDeductionAmount] =
    useState<number>(0);
  const [currentActualAmount, setCurrentActualAmount] = useState<number>(0);
  const [isLocked, setIsLocked] = useState(true);
  const [merchandisesItem, setMerchandisesItem] = useState<MerchandisesItem>();
  const [originalAssetId, setOriginalAssetId] = useState<string>();

  const userInfo = useAppSelector((state) => state.common.userInfo);
  const usdtBalance = useAppSelector((state) => state.common.usdtBalance);
  const elfBalance = useAppSelector((state) => state.common.elfBalance);
  const orgBalance = useAppSelector((state) => state.common.orgBalance);

  const getAssetsListTemp = useCallback(async () => {
    const getAssetsListRes = await getAssetsList({
      type: 0,
      category: 0,
      skipCount: 0,
      maxResultCount: 100,
    });
    console.log('getAssetsList', getAssetsListRes);
    if (getAssetsListRes?.items?.length === 1) {
      const asset = getAssetsListRes?.items[0];
      setIsLocked(asset?.isLocked);
      setOriginalAssetId(asset?.id);
      setFreeQuantity(asset?.freeQuantity);
      setCurrentQueryCount(asset?.quantity);
    }
  }, []);

  useEffect(() => {
    getAssetsListTemp();
  }, [getAssetsListTemp]);

  const getBalance = useCallback(async () => {
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
    // eslint-disable-next-line
  }, [
    callViewMethod,
    getAccountByChainId,
    dispatch,
    messageApi,
    walletInfoRef.current,
    isConnectedRef.current,
  ]);

  useEffect(() => {
    getBalance();
  }, [getBalance]);

  const getOrgBalanceTemp = useCallback(async () => {
    const getOrgBalanceRes = await getOrgBalance();
    console.log('getOrgBalance', getOrgBalanceRes);
    if (getOrgBalanceRes?.balance) {
      dispatch(setOrgBalance(getOrgBalanceRes));
    }
  }, [dispatch]);

  useEffect(() => {
    getOrgBalanceTemp();
  }, [getOrgBalanceTemp]);

  const getMerchandisesListTemp = useCallback(async () => {
    const { items } = await getMerchandisesList({
      type: 0,
      category: 0,
    });
    console.log('getMerchandisesList items', items);
    if (items?.length > 0) {
      setMerchandisesItem(items[0]);
    }
  }, []);

  useEffect(() => {
    getMerchandisesListTemp();
  }, [getMerchandisesListTemp]);

  const watchOrdersCostTemp = useThrottleCallback(async () => {
    if (!merchandisesItem?.id || !currentQueryCount || isLocked) {
      return;
    }
    const params = {
      originalAssetId: '',
      merchandiseId: merchandisesItem?.id,
      quantity: currentQueryCount,
      replicas: 1,
    };
    if (originalAssetId) {
      params.originalAssetId = originalAssetId;
    }
    const watchOrdersCostRes = await watchOrdersCost({
      details: [params],
    });
    console.log('watchOrdersCost', watchOrdersCostRes);
    if (watchOrdersCostRes) {
      setCurrentAmount(watchOrdersCostRes?.amount);
      setCurrentDeductionAmount(watchOrdersCostRes?.deductionAmount);
      setCurrentActualAmount(watchOrdersCostRes?.actualAmount);
    }
  }, [currentQueryCount, merchandisesItem?.id, originalAssetId, isLocked]);

  useEffect(() => {
    watchOrdersCostTemp();
  }, [watchOrdersCostTemp]);

  const handleRouteBack = useCallback(() => {
    setCurrentQueryCount(100000);
    setIsLocked(true);
    setOriginalAssetId('');
    setCurrentAmount(0);
    setCurrentDeductionAmount(0);
    setCurrentActualAmount(0);
    router.back();
  }, [router]);

  const handlePreCreateOrder = useCallback(async () => {
    if (!merchandisesItem?.id || !currentQueryCount || isLocked) {
      return {
        billingId: '',
        billingAmount: 0,
      };
    }
    const params = {
      originalAssetId: '',
      merchandiseId: merchandisesItem?.id,
      quantity: currentQueryCount,
      replicas: 1,
    };
    if (originalAssetId) {
      params.originalAssetId = originalAssetId;
    }
    const newOrderItemRes = await order({
      details: [params],
    });
    if (newOrderItemRes) {
      const { id, actualAmount } = newOrderItemRes;
      return {
        billingId: id,
        billingAmount: actualAmount,
      };
    } else {
      return {
        billingId: '',
        billingAmount: 0,
      };
    }
  }, [merchandisesItem?.id, currentQueryCount, originalAssetId, isLocked]);

  const handleCreateOrder = useDebounceCallback(async () => {
    setLoading(true);
    const { billingId, billingAmount } = await handlePreCreateOrder();
    // if actualAmount = 0, customer need't to lock
    if (billingAmount === 0) {
      messageApi.open({
        type: 'success',
        content:
          'Confirm purchase successfully, please wait for the confirmation of the transaction',
        duration: 3,
      });
      setTimeout(() => {
        handleRouteBack();
      }, 4000);
      return;
    }
    try {
      if (!billingId || !billingAmount) {
        messageApi.warning('Create order failed');
        return;
      }
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
          content: 'Confirm monthly purchase successfully',
          duration: 3,
        });
        // refresh balance when Confirm monthly purchase success
        await getBalance();
        await getOrgBalanceTemp();
        const payRes = await payOrder({
          id: billingId,
          paymentType: 1,
        });
        if (payRes) {
          setTimeout(() => {
            handleRouteBack();
          }, 4000);
        }
      } else {
        messageApi.open({
          type: 'info',
          content: 'Confirm monthly purchase failed',
        });
        await cancelOrder({
          id: billingId,
        });
      }
      console.log('lockResult', lockResult);
    } catch (error) {
      messageApi.open({
        type: 'error',
        content: `Confirm monthly purchase failed : ${handleErrorMessage(
          error
        )}`,
      });
      await cancelOrder({
        id: billingId,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className='px-[16px] pb-[36px] sm:px-[40px]'>
      {contextHolder}
      <div className='border-gray-F0 flex h-[120px] flex-col items-start justify-center border-b'>
        <div>
          <LeftOutlined
            className='relative top-[-7px] mr-[16px] cursor-pointer align-middle text-sm'
            onClick={handleRouteBack}
          />
          <span className='text-3xl text-black'>Purchase</span>
        </div>
        {isLocked && (
          <Tag
            color='processing'
            className='mt-[10px] w-full truncate leading-10'
          >
            You have unfinished orders and temporarily cannot place more orders.
          </Tag>
        )}
      </div>
      <div className='mt-[24px]'>
        <Row gutter={24}>
          <Col xs={24} md={14}>
            <div className='mb-[28px] flex items-center justify-between'>
              <div className='text-xl font-medium text-black'>
                <Image
                  src='/assets/svg/step1.svg'
                  alt='step1'
                  width={24}
                  height={24}
                  className='relative top-[-2px] mr-[16px] inline-block align-middle'
                />
                Estimated number of queries
              </div>
              <div>
                <span className='text-dark-normal'>250,000k</span>
                <span
                  className='text-blue-link ml-[16px] cursor-pointer'
                  onClick={() => setCurrentQueryCount(250000000)}
                >
                  Max
                </span>
              </div>
            </div>
            <Slider
              value={currentQueryCount}
              min={freeQuantity}
              max={250000000}
              step={10000}
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
            <div className='my-[8px] flex items-start justify-start'>
              <span className='text-gray-80 mr-[16px] text-sm'>
                Billing balance:
              </span>
              <div>
                <div className='text-dark-normal mr-[2px] text-sm'>
                  {orgBalance?.balance || '--'} USDT{' '}
                </div>
                <div className='text-gray-80 mt-[6px] text-sm'>
                  Locked: {orgBalance?.lockedBalance || '--'} USDT
                </div>
              </div>
            </div>
            <Tag
              icon={
                <ExclamationCircleOutlined className='relative top-[-3px]' />
              }
              color='processing'
              className='my-[8px] h-[40px] w-full truncate leading-10'
            >
              <span className='text-gray-80 w-full text-sm'>
                You will be able to withdraw your unlocked balance at any time
              </span>
            </Tag>
            {currentActualAmount > orgBalance?.balance && (
              <Tag
                icon={
                  <ExclamationCircleOutlined className='relative top-[-3px]' />
                }
                color='warning'
                className='h-[40px] w-full truncate leading-10'
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
                  {currentActualAmount} USDT/month
                </div>
              </div>
              {currentActualAmount > orgBalance?.balance && (
                <Button type='default' disabled={true}>
                  Insufficient billing balance
                </Button>
              )}
              {currentActualAmount <= orgBalance?.balance && (
                <Button
                  type='primary'
                  disabled={isLocked}
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
          <Col
            xs={24}
            md={9}
            offset={isMobile ? 0 : 1}
            className='mt-[24px] sm:mt-[0px]'
          >
            <div className='text-xl font-medium text-black'>
              Your Plan Details
            </div>
            <div className='text-gray-80 my-[16px] text-sm'>
              Growth plan will also include 100K free monthly queries.
            </div>
            <div className='bg-gray-F5 rounded-lg p-[20px]'>
              <div className='mb-[20px] flex justify-between'>
                <div className='text-gray-80 text-sm'>Est. Queries</div>
                <div className='text-dark-normal'>{currentQueryCount}</div>
              </div>
              <Divider />
              <div className='flex justify-between'>
                <div className='text-gray-80 text-sm'>Month</div>
                <div className='text-dark-normal'>1</div>
              </div>
              <div className='mt-[20px] flex justify-between'>
                <div className='text-gray-80 text-sm'>Est. Price</div>
                <div className='text-dark-normal'>
                  {merchandisesItem?.price ?? '--'} USDT/Query
                </div>
              </div>
              <Divider />
              <div className='flex justify-between'>
                <div className='text-gray-80 text-sm'>Amount</div>
                <div className='text-dark-normal'>{currentAmount} USDT</div>
              </div>
              <div className='mt-[20px] flex justify-between'>
                <div className='text-gray-80 text-sm'>DeductionAmount</div>
                <div className='text-dark-normal'>
                  {currentDeductionAmount} USDT
                </div>
              </div>
              <div className='mt-[20px] flex justify-between'>
                <div className='text-dark-normal'>ActualAmount</div>
                <div className='text-dark-normal'>
                  {currentActualAmount} USDT
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
