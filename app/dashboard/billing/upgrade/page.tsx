'use client';

import { TWalletInfo } from '@aelf-web-login/wallet-adapter-base';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import { ExclamationCircleOutlined, LeftOutlined } from '@ant-design/icons';
import { Button, Col, Divider, InputNumber, message, Row, Tag } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import {
  handleErrorMessage,
  timesDecimals,
  useDebounceCallback,
  useThrottleCallback,
} from '@/lib/utils';

import QuerySlider from '@/components/billing/QuerySlider';
import ConnectWalletFirst from '@/components/wallet/ConnectWalletFirst';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setOrgBalance } from '@/store/slices/commonSlice';

import {
  cancelOrder,
  getAssetsList,
  getMerchandisesList,
  getOrgBalance,
  order,
  payOrder,
  watchOrdersCost,
} from '@/api/requestMarket';
import { AeFinderContractAddress, CHAIN_ID } from '@/constant';

import { ApproveResponseType } from '@/types/appType';
import { MerchandisesItem } from '@/types/marketType';

export default function Upgrade() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const { callSendMethod, walletInfo, isConnected, disConnectWallet } =
    useConnectWallet();

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

  const getOrgBalanceTemp = useCallback(async () => {
    const getOrgBalanceRes = await getOrgBalance();
    console.log('getOrgBalance', getOrgBalanceRes);
    if (getOrgBalanceRes?.balance !== null) {
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

  // check current wallet address === bind address
  const checkAddressEqual = useCallback(() => {
    if (!isConnectedRef.current || !walletInfoRef.current) {
      return false;
    }
    return userInfo?.walletAddress === walletInfoRef.current?.address;
  }, [userInfo?.walletAddress]);

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
    if (billingId && billingAmount === 0) {
      messageApi.open({
        type: 'success',
        content:
          'Confirm purchase successfully, please wait for the confirmation of the transaction',
        duration: 3,
      });
      setTimeout(() => {
        handleRouteBack();
      }, 2000);
      return;
    }

    if (!checkAddressEqual()) {
      messageApi.warning('Please using the wallet address you have bound.');
      await disConnectWallet();
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
        chainId: CHAIN_ID,
      });
      if (lockResult?.data?.Status === 'MINED') {
        messageApi.open({
          type: 'success',
          content: 'Confirm monthly purchase successfully',
          duration: 3,
        });
        await getOrgBalanceTemp();
        const payRes = await payOrder({
          id: billingId,
          paymentType: 1,
        });
        if (payRes) {
          setTimeout(() => {
            handleRouteBack();
          }, 2000);
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
  }, [checkAddressEqual, disConnectWallet]);

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
                <span className='text-dark-normal'>
                  <InputNumber
                    placeholder='Please input the query count'
                    value={currentQueryCount}
                    onChange={(value) => {
                      if (value && Number.isInteger(value) && value > 0) {
                        setCurrentQueryCount(value);
                      } else if (value === null || value < freeQuantity) {
                        setCurrentQueryCount(freeQuantity);
                      }
                    }}
                    min={freeQuantity}
                    max={250000000}
                    addonAfter={
                      <span
                        className='text-blue-link cursor-pointer'
                        onClick={() => setCurrentQueryCount(250000000)}
                      >
                        Max
                      </span>
                    }
                    disabled={isLocked}
                  />
                </span>
              </div>
            </div>
            <QuerySlider
              currentQueryCount={currentQueryCount}
              setCurrentQueryCount={setCurrentQueryCount}
              freeQuantity={freeQuantity}
              isLocked={isLocked}
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
            <div className='my-[8px] flex items-start justify-start'>
              <span className='text-gray-80 mr-[6px] text-sm'>
                Billing balance:
              </span>
              <div className='text-dark-normal mr-[2px] text-sm'>
                {orgBalance?.balance || '--'} USDT
              </div>
            </div>
            <div className='text-gray-80 my-[8px] text-sm'>
              Locked balance: {orgBalance?.lockedBalance || '--'} USDT
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
              {currentActualAmount <= orgBalance?.balance &&
                isConnectedRef.current &&
                walletInfoRef.current && (
                  <Button
                    type='primary'
                    disabled={isLocked}
                    onClick={handleCreateOrder}
                    loading={loading}
                  >
                    Confirm monthly purchase
                  </Button>
                )}
              {currentActualAmount <= orgBalance?.balance &&
                (!isConnectedRef.current || !walletInfoRef.current) && (
                  <ConnectWalletFirst />
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
