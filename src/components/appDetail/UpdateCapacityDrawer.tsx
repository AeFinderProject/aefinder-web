'use client';

import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import type { CollapseProps } from 'antd';
import { Button, Col, Collapse, Divider, Drawer, InputNumber, Row } from 'antd';
import { MessageInstance } from 'antd/es/message/interface';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import {
  handleErrorMessage,
  isValidJSON,
  timesDecimals,
  useDebounceCallback,
} from '@/lib/utils';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setOrgBalance } from '@/store/slices/commonSlice';

import {
  cancelOrder,
  getOrgBalance,
  order,
  payOrder,
  watchOrdersCost,
} from '@/api/requestMarket';
import { getAssetsList, getMerchandisesList } from '@/api/requestMarket';
import { AeFinderContractAddress } from '@/constant';

import { ApproveResponseType } from '@/types/appType';
import { MerchandisesItem } from '@/types/marketType';

type DeployDrawerProps = {
  readonly isShowUpdateCapacityModal: boolean;
  readonly setIsShowUpdateCapacityModal: (visible: boolean) => void;
  readonly messageApi: MessageInstance;
};

export default function UpdateCapacityDrawer({
  isShowUpdateCapacityModal,
  setIsShowUpdateCapacityModal,
  messageApi,
}: DeployDrawerProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { callSendMethod } = useConnectWallet();

  const [isShowCapacityCollapse, setIsShowCapacityCollapse] = useState(false);
  const [loading, setLoading] = useState(false);
  const orgBalance = useAppSelector((state) => state.common.orgBalance);
  const currentAppDetail = useAppSelector(
    (state) => state.app.currentAppDetail
  );

  // default original processor '' to distinct with current processor
  const [originalCapacityType, setOriginalCapacityType] = useState('');
  const [currentCapacityType, setCurrentCapacityType] = useState('Small');
  // default original storage num 0 to distinct with current storage num
  const [originalStorageNum, setOriginalStorageNum] = useState<number>(0);
  const [currentStorageNum, setCurrentStorageNum] = useState<number>(1);

  const [processMerchandisesList, setProcessMerchandisesList] = useState<
    MerchandisesItem[]
  >([]);
  const [storageMerchandisesList, setStorageMerchandisesList] = useState<
    MerchandisesItem[]
  >([]);

  const [isProcessLocked, setIsProcessLocked] = useState<boolean>(false);
  const [isStorageLocked, setIsStorageLocked] = useState<boolean>(false);
  const [processOriginalAssetId, setProcessOriginalAssetId] =
    useState<string>();
  const [storageOriginalAssetId, setStorageOriginalAssetId] =
    useState<string>();

  const [currentProcessAmount, setCurrentProcessAmount] = useState<number>(0);
  const [currentProcessDeductionAmount, setCurrentProcessDeductionAmount] =
    useState<number>(0);
  const [currentProcessActualAmount, setCurrentProcessActualAmount] =
    useState<number>(0);
  const [currentStorageAmount, setCurrentStorageAmount] = useState<number>(0);
  const [currentStorageDeductionAmount, setCurrentStorageDeductionAmount] =
    useState<number>(0);
  const [currentStorageActualAmount, setCurrentStorageActualAmount] =
    useState<number>(0);
  const [currentTotalAmount, setCurrentTotalAmount] = useState<number>(0);
  const [currentTotalDeductionAmount, setCurrentTotalDeductionAmount] =
    useState<number>(0);
  const [currentTotalActualAmount, setCurrentTotalActualAmount] =
    useState<number>(0);

  const getMerchandisesListTemp = useCallback(async () => {
    const { items } = await getMerchandisesList({
      type: 1,
    });
    console.log('getMerchandisesList items', items);
    setProcessMerchandisesList(items);

    const merchandisesListRes = await getMerchandisesList({
      type: 2,
    });
    console.log('merchandisesListRes', merchandisesListRes);
    setStorageMerchandisesList(merchandisesListRes?.items);
  }, []);

  useEffect(() => {
    getMerchandisesListTemp();
  }, [getMerchandisesListTemp]);

  const getAssetsListTemp = useCallback(async () => {
    const getProcessorAssetListRes = await getAssetsList({
      appId: currentAppDetail?.appId,
      type: 1,
      skipCount: 0,
      maxResultCount: 100,
    });
    console.log('getProcessorAssetListRes', getProcessorAssetListRes);
    if (getProcessorAssetListRes?.items?.length === 2) {
      setIsProcessLocked(true);
    }
    if (getProcessorAssetListRes?.items?.length === 1) {
      const asset = getProcessorAssetListRes?.items[0];
      setIsProcessLocked(asset?.isLocked);
      setProcessOriginalAssetId(asset?.id);
      setCurrentCapacityType(asset?.merchandise?.name);
      setOriginalCapacityType(asset?.merchandise?.name);
    }

    const getStorageAssetListRes = await getAssetsList({
      appId: currentAppDetail?.appId,
      type: 2,
      skipCount: 0,
      maxResultCount: 100,
    });
    console.log('getStorageAssetListRes', getStorageAssetListRes);
    if (getStorageAssetListRes?.items?.length === 2) {
      setIsStorageLocked(true);
    }
    if (getStorageAssetListRes?.items?.length === 1) {
      const asset = getStorageAssetListRes?.items[0];
      setIsStorageLocked(asset?.isLocked);
      setStorageOriginalAssetId(asset?.id);
      if (asset?.replicas) {
        setCurrentStorageNum(asset?.replicas);
        setOriginalStorageNum(asset?.replicas);
      }
    }
    // eslint-disable-next-line
  }, [currentAppDetail?.appId, isShowUpdateCapacityModal]);

  useEffect(() => {
    getAssetsListTemp();
  }, [getAssetsListTemp]);

  const getOrgBalanceTemp = useDebounceCallback(async () => {
    const getOrgBalanceRes = await getOrgBalance();
    console.log('getOrgBalance', getOrgBalanceRes);
    if (getOrgBalanceRes?.balance !== null) {
      dispatch(setOrgBalance(getOrgBalanceRes));
    }
  }, [getOrgBalance]);

  useEffect(() => {
    getOrgBalanceTemp();
  }, [getOrgBalanceTemp]);

  const watchOrdersCostTemp = useDebounceCallback(async () => {
    console.log('processMerchandisesList', processMerchandisesList);
    const currentProcessMerchandise = processMerchandisesList.find(
      (item) => item.name === currentCapacityType
    );
    console.log(currentProcessMerchandise?.id, storageMerchandisesList[0]?.id);
    if (!currentProcessMerchandise?.id || !storageMerchandisesList[0]?.id) {
      return;
    }
    if (!currentCapacityType || !currentStorageNum) {
      messageApi.warning('Please select the capacity and storage capacity');
      return;
    }

    const processorParams = {
      originalAssetId: '',
      merchandiseId: currentProcessMerchandise?.id || '',
      quantity: 1,
      replicas: 1,
    };
    if (processOriginalAssetId) {
      processorParams.originalAssetId = processOriginalAssetId;
    }

    const storageParams = {
      originalAssetId: '',
      merchandiseId: storageMerchandisesList[0]?.id || '',
      quantity: 1,
      replicas: currentStorageNum,
    };
    if (storageOriginalAssetId) {
      storageParams.originalAssetId = storageOriginalAssetId;
    }

    const details = [];
    if (originalCapacityType !== currentCapacityType) {
      details.push(processorParams);
    }

    if (originalStorageNum !== currentStorageNum) {
      details.push(storageParams);
    }

    const watchOrdersCostRes = await watchOrdersCost({
      details: details,
    });
    console.log('watchOrdersCost', watchOrdersCostRes);
    if (watchOrdersCostRes) {
      // step 1: set total amount
      setCurrentTotalAmount(watchOrdersCostRes?.amount);
      setCurrentTotalDeductionAmount(watchOrdersCostRes?.deductionAmount);
      setCurrentTotalActualAmount(watchOrdersCostRes?.actualAmount);
      // step 2: set processor or storage amount
      watchOrdersCostRes?.details?.map((item) => {
        if (item?.merchandise?.type === 1) {
          setCurrentProcessAmount(item?.amount);
          setCurrentProcessDeductionAmount(item?.deductionAmount);
          setCurrentProcessActualAmount(item?.actualAmount);
        } else if (item?.merchandise?.type === 2) {
          setCurrentStorageAmount(item?.amount);
          setCurrentStorageDeductionAmount(item?.deductionAmount);
          setCurrentStorageActualAmount(item?.actualAmount);
        }
      });
    }
  }, [
    processMerchandisesList,
    storageMerchandisesList,
    currentCapacityType,
    currentStorageNum,
    originalCapacityType,
    originalStorageNum,
    processOriginalAssetId,
    storageOriginalAssetId,
    currentAppDetail?.appId,
  ]);

  useEffect(() => {
    watchOrdersCostTemp();
  }, [watchOrdersCostTemp]);

  const onChange: CollapseProps['onChange'] = (key) => {
    console.log(key);
    setIsShowCapacityCollapse((pre) => !pre);
  };

  const handleClose = useCallback(() => {
    setIsShowUpdateCapacityModal(false);
  }, [setIsShowUpdateCapacityModal]);

  const handlePreCreateOrder = useCallback(async () => {
    const currentProcessMerchandise = processMerchandisesList.find(
      (item) => item.name === currentCapacityType
    );
    if (!currentProcessMerchandise?.id || !storageMerchandisesList[0]?.id) {
      return {
        billingId: '',
        billingAmount: 0,
      };
    }
    if (!currentCapacityType || !currentStorageNum) {
      messageApi.warning('Please select the capacity and storage capacity');
      return {
        billingId: '',
        billingAmount: 0,
      };
    }

    const processorParams = {
      originalAssetId: '',
      merchandiseId: currentProcessMerchandise?.id || '',
      quantity: 1,
      replicas: 1,
    };
    if (processOriginalAssetId) {
      processorParams.originalAssetId = processOriginalAssetId;
    }

    const storageParams = {
      originalAssetId: '',
      merchandiseId: storageMerchandisesList[0]?.id || '',
      quantity: 1,
      replicas: currentStorageNum,
    };
    if (storageOriginalAssetId) {
      storageParams.originalAssetId = storageOriginalAssetId;
    }

    const details = [];
    // to create order: need no isLocked and the value changed
    if (!isProcessLocked && currentCapacityType !== originalCapacityType) {
      details.push(processorParams);
    }
    if (!isStorageLocked && currentStorageNum !== originalStorageNum) {
      details.push(storageParams);
    }

    const newOrderItemRes = await order({
      details: details,
      extraData: {
        RelateAppId: currentAppDetail?.appId,
      },
    });
    if (newOrderItemRes) {
      const { id, actualAmount } = newOrderItemRes;
      return {
        billingId: id,
        billingAmount: actualAmount,
      };
    }
    // finally return empty value
    return {
      billingId: '',
      billingAmount: 0,
    };
  }, [
    currentCapacityType,
    currentStorageNum,
    isProcessLocked,
    isStorageLocked,
    processMerchandisesList,
    storageMerchandisesList,
    processOriginalAssetId,
    storageOriginalAssetId,
    originalCapacityType,
    originalStorageNum,
    messageApi,
    currentAppDetail?.appId,
  ]);

  const handleSave = useDebounceCallback(async () => {
    setLoading(true);
    const { billingId, billingAmount } = await handlePreCreateOrder();
    if (billingAmount === 0) {
      messageApi.open({
        type: 'success',
        content:
          'Confirm purchase processor and storage successfully, please wait for the confirmation of the transaction',
        duration: 3,
      });
      handleClose();
      return;
    }
    try {
      console.log('billingId, billingAmount', billingId, billingAmount);
      if (!billingId || !billingAmount) {
        messageApi.warning('Create order failed');
        setLoading(false);
        setIsShowUpdateCapacityModal(false);
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
          content: 'Successfully updated capacity',
          duration: 10,
        });
        // refresh balance when Confirm monthly purchase success
        getOrgBalanceTemp();
        await payOrder({
          id: billingId,
          paymentType: 1,
        });
        handleClose();
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
      console.log('error', error);
      messageApi.open({
        type: 'error',
        content: `Confirm monthly purchase failed: ${handleErrorMessage(
          error
        )}`,
      });
      await cancelOrder({
        id: billingId,
      });
    } finally {
      setLoading(false);
    }
  }, [messageApi, handleClose, handlePreCreateOrder]);

  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: `${isShowCapacityCollapse ? 'Hide' : 'Show'} capacity details`,
      children: (
        <div>
          <Row gutter={24}>
            <Col span={5} className='text-gray-80 text-xs'>
              Name
            </Col>
            <Col span={6} className='text-gray-80 text-xs'>
              Price
            </Col>
            <Col span={7} className='text-gray-80 text-xs'>
              CPU
            </Col>
            <Col span={6} className='text-gray-80 text-xs'>
              Memory
            </Col>
          </Row>
          <Divider className='my-[8px]' />
          {processMerchandisesList?.map((item) => {
            return (
              <Row gutter={24} key={item?.id} className='mt-[10px]'>
                <Col span={5} className='text-gray-80 text-sm'>
                  {item?.name}
                </Col>
                <Col span={6} className='text-gray-80 text-sm'>
                  {item?.price}
                </Col>
                <Col span={7} className='text-gray-80 text-sm'>
                  {isValidJSON(item?.specification)
                    ? JSON.parse(item?.specification)?.cpu
                    : '--'}
                </Col>
                <Col span={6} className='text-gray-80 text-sm'>
                  {isValidJSON(item?.specification)
                    ? JSON.parse(item?.specification)?.memory
                    : '--'}
                </Col>
              </Row>
            );
          })}
        </div>
      ),
    },
  ];

  return (
    <Drawer
      title='Update Capacity'
      placement='right'
      onClose={handleClose}
      open={isShowUpdateCapacityModal}
    >
      <Collapse items={items} onChange={onChange} />
      <div className='text-dark-normal mb-[10px] mt-[24px]'>
        Processor Capacity:
      </div>
      <div className='mb-[20px] flex items-center justify-between'>
        {processMerchandisesList?.map((item) => {
          return (
            <Button
              key={item?.id}
              type={currentCapacityType === item.name ? 'primary' : 'default'}
              className='w-[30%]'
              onClick={() => setCurrentCapacityType(item.name)}
              disabled={isProcessLocked}
            >
              {item.name}
            </Button>
          );
        })}
      </div>
      <div className='text-dark-normal mb-[10px] mt-[24px]'>
        Storage Capacity:
      </div>
      <div className='mb-[20px]'>
        <InputNumber
          placeholder='Please input the storage capacity'
          className='w-full'
          value={currentStorageNum}
          onChange={(value) => {
            if (value && Number.isInteger(value) && value > 0) {
              setCurrentStorageNum(value);
            } else if (value === null) {
              setCurrentStorageNum(1);
            }
          }}
          min={1}
          max={1000000}
          addonAfter='GB'
          disabled={isStorageLocked}
        />
      </div>
      {currentTotalActualAmount > orgBalance?.balance && (
        <div className='border-gray-E0 mb-[24px] flex items-center justify-between rounded-lg border px-[9px] py-[12px]'>
          <div></div>
          <div className='text-sm'>
            You currently do not have enough balance to create the AeIndexer. To
            proceed,
            <span
              className='text-blue-link cursor-pointer'
              onClick={() => router.push('/dashboard/billing/deposit')}
            >
              {' '}
              please deposit the required amount{' '}
            </span>
            .
          </div>
        </div>
      )}
      <div className='bg-gray-F5 rounded-lg p-[20px]'>
        <div className='flex items-center justify-between'>
          <span className='text-gray-80 text-sm'>Billing Balance</span>
          <span className='text-dark-normal'>{orgBalance?.balance} USDT</span>
        </div>
        <div className='mt-[10px] flex items-center justify-between'>
          <span className='text-gray-80 text-sm'>Locked</span>
          <span className='text-dark-normal'>
            {orgBalance?.lockedBalance} USDT
          </span>
        </div>
        {originalCapacityType !== currentCapacityType && (
          <div>
            <Divider className='my-[20px]' />
            <div className='flex justify-between'>
              <div className='text-gray-80 text-sm'>Processor Amount</div>
              <div className='text-dark-normal'>
                {currentProcessAmount} USDT
              </div>
            </div>
            <div className='mt-[20px] flex justify-between'>
              <div className='text-gray-80 text-sm'>
                Processor Deduction Amount
              </div>
              <div className='text-dark-normal'>
                {currentProcessDeductionAmount} USDT
              </div>
            </div>
            <div className='mt-[20px] flex justify-between'>
              <div className='text-dark-normal'>Processor Actual Amount</div>
              <div className='text-dark-normal'>
                {currentProcessActualAmount} USDT
              </div>
            </div>
          </div>
        )}
        {originalStorageNum !== currentStorageNum && (
          <div>
            <Divider className='my-[20px]' />
            <div className='flex justify-between'>
              <div className='text-gray-80 text-sm'>Storage Amount</div>
              <div className='text-dark-normal'>
                {currentStorageAmount} USDT
              </div>
            </div>
            <div className='mt-[20px] flex justify-between'>
              <div className='text-gray-80 text-sm'>
                Storage Deduction Amount
              </div>
              <div className='text-dark-normal'>
                {currentStorageDeductionAmount} USDT
              </div>
            </div>
            <div className='mt-[20px] flex justify-between'>
              <div className='text-dark-normal'>Storage Actual Amount</div>
              <div className='text-dark-normal'>
                {currentStorageActualAmount} USDT
              </div>
            </div>
          </div>
        )}
        {(originalCapacityType !== currentCapacityType ||
          originalStorageNum !== currentStorageNum) && (
          <div>
            <Divider className='my-[20px]' />
            <div className='flex justify-between'>
              <div className='text-gray-80 text-sm'>Total Amount</div>
              <div className='text-dark-normal'>{currentTotalAmount} USDT</div>
            </div>
            <div className='mt-[20px] flex justify-between'>
              <div className='text-gray-80 text-sm'>Total Deduction Amount</div>
              <div className='text-dark-normal'>
                {currentTotalDeductionAmount} USDT
              </div>
            </div>
            <div className='mt-[20px] flex justify-between'>
              <div className='text-dark-normal'>Total Actual Amount</div>
              <div className='text-dark-normal'>
                {currentTotalActualAmount} USDT
              </div>
            </div>
          </div>
        )}
      </div>
      <Button
        type='primary'
        className='mt-[24px] w-full'
        size='large'
        onClick={handleSave}
        loading={loading}
        disabled={
          originalCapacityType === currentCapacityType &&
          originalStorageNum === currentStorageNum
        }
      >
        Save
      </Button>
      <Divider className='my-[24px]' />
      <div className='text-gray-80 mt-[24px] text-sm'>
        Processor Amount = (The remaining hours of the current month) * price
      </div>
      <div className='text-gray-80 mt-[10px] text-sm'>
        *This amount will remain locked in your Billing Balance and be charged
        at the end of the month.
      </div>
    </Drawer>
  );
}
