'use client';

import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import type { CollapseProps } from 'antd';
import { Button, Col, Collapse, Divider, Drawer, InputNumber, Row } from 'antd';
import { MessageInstance } from 'antd/es/message/interface';
import Image from 'next/image';
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
} from '@/api/requestMarket';
import { getAssetsList, getMerchandisesList } from '@/api/requestMarket';
import { AeFinderContractAddress } from '@/constant';

import { ApproveResponseType } from '@/types/appType';
import { AssetsItem, MerchandisesItem } from '@/types/marketType';

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

  const [currentCapacityType, setCurrentCapacityType] = useState('Small');
  const [currentStorageNum, setCurrentStorageNum] = useState<number | null>(
    null
  );

  const [processMerchandisesList, setProcessMerchandisesList] = useState<
    MerchandisesItem[]
  >([]);
  const [storageMerchandisesList, setStorageMerchandisesList] = useState<
    MerchandisesItem[]
  >([]);
  const [processorAssetList, setProcessorAssetList] = useState<AssetsItem[]>(
    []
  );
  const [storageAssetList, setStorageAssetList] = useState<AssetsItem[]>([]);

  const [isProcessLocked, setIsProcessLocked] = useState<boolean>(true);
  const [isStorageLocked, setIsStorageLocked] = useState<boolean>(true);
  const [processOriginalAssetId, setProcessOriginalAssetId] =
    useState<string>();
  const [storageOriginalAssetId, setStorageOriginalAssetId] =
    useState<string>();

  const [currentAmount, setCurrentAmount] = useState<number>(0);
  const [currentDeductionAmount, setCurrentDeductionAmount] =
    useState<number>(0);
  const [currentActualAmount, setCurrentActualAmount] = useState<number>(0);

  // todo  delete start
  console.log(storageMerchandisesList, processorAssetList, storageAssetList);
  setCurrentAmount(0);
  setCurrentDeductionAmount(0);
  setCurrentActualAmount(0);
  // todo  delete end

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
    setProcessorAssetList(getProcessorAssetListRes?.items);
    if (getProcessorAssetListRes?.items?.length === 1) {
      const asset = getProcessorAssetListRes?.items[0];
      setIsProcessLocked(asset?.isLocked);
      setProcessOriginalAssetId(asset?.id);
      setCurrentCapacityType(asset?.merchandise?.name);
    }

    const getStorageAssetListRes = await getAssetsList({
      appId: currentAppDetail?.appId,
      type: 2,
      skipCount: 0,
      maxResultCount: 100,
    });
    console.log('getStorageAssetListRes', getStorageAssetListRes);
    setStorageAssetList(getStorageAssetListRes?.items);
    if (getStorageAssetListRes?.items?.length === 1) {
      const asset = getStorageAssetListRes?.items[0];
      setIsStorageLocked(asset?.isLocked);
      setStorageOriginalAssetId(asset?.id);
      if (asset?.quantity) {
        setCurrentStorageNum(asset?.quantity);
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
    if (getOrgBalanceRes?.balance) {
      dispatch(setOrgBalance(getOrgBalanceRes));
    }
  }, [getOrgBalance]);

  useEffect(() => {
    getOrgBalanceTemp();
  }, [getOrgBalanceTemp]);

  const onChange: CollapseProps['onChange'] = (key) => {
    console.log(key);
    setIsShowCapacityCollapse((pre) => !pre);
  };

  const handleClose = useCallback(() => {
    setIsShowUpdateCapacityModal(false);
  }, [setIsShowUpdateCapacityModal]);

  const handlePreCreateOrder = useCallback(async () => {
    if (
      !processOriginalAssetId ||
      isProcessLocked ||
      !storageOriginalAssetId ||
      isStorageLocked
    ) {
      return {
        billingId: '',
        billingAmount: 0,
      };
    }
    const currentProcessMerchandise = processMerchandisesList.find(
      (item) => item.specification === currentCapacityType
    );
    const processorParams = {
      originalAssetId: '',
      merchandiseId: currentProcessMerchandise?.id || '',
      quantity: 1,
      replicas: 1,
    };
    if (processOriginalAssetId) {
      processorParams.originalAssetId = processOriginalAssetId;
    }

    const details = [];

    if (!isProcessLocked) {
      details.push(processorParams);
    }

    const newOrderItemRes = await order({
      details: [processorParams],
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
  }, [
    currentCapacityType,
    isProcessLocked,
    isStorageLocked,
    processMerchandisesList,
    processOriginalAssetId,
    storageOriginalAssetId,
  ]);

  const handleSave = useDebounceCallback(async () => {
    setLoading(true);
    const { billingId, billingAmount } = await handlePreCreateOrder();
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
          onChange={(value) => setCurrentStorageNum(value)}
          min={1}
          max={1000000}
          addonAfter='GB'
          disabled={isStorageLocked}
        />
      </div>
      {currentActualAmount > orgBalance?.balance && (
        <div className='border-gray-E0 mb-[24px] flex items-center justify-between rounded-lg border px-[9px] py-[12px]'>
          <Image
            src='/assets/svg/close-filled.svg'
            alt='user'
            width={16}
            height={16}
            className='mr-[8px]'
          />
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
        <div className='mb-[20px] flex items-center justify-between'>
          <span className='text-gray-80 text-sm'>Capacity Cost*</span>
          <span className='text-dark-normal'>
            {/* {currentResourceBillPlan?.monthlyUnitPrice} USDT/month */}
          </span>
        </div>
        <div className='flex items-center justify-between'>
          <span className='text-gray-80 text-sm'>First Month Cost*</span>
          <span className='text-dark-normal'>
            {/* {currentResourceBillPlan?.firstMonthCost?.toFixed(2)} USDT */}
          </span>
        </div>
        <Divider className='my-[20px]' />
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
        <Divider className='my-[20px]' />
        <div className='flex justify-between'>
          <div className='text-gray-80 text-sm'>Amount</div>
          <div className='text-dark-normal'>{currentAmount} USDT</div>
        </div>
        <div className='mt-[20px] flex justify-between'>
          <div className='text-gray-80 text-sm'>DeductionAmount</div>
          <div className='text-dark-normal'>{currentDeductionAmount} USDT</div>
        </div>
        <div className='mt-[20px] flex justify-between'>
          <div className='text-dark-normal'>ActualAmount</div>
          <div className='text-dark-normal'>{currentActualAmount} USDT</div>
        </div>
      </div>
      <div className='text-gray-80 mt-[24px] text-sm'>
        *This amount will remain locked in your Billing Balance and be charged
        at the end of the month.
      </div>
      <Divider className='my-[24px]' />
      <Button
        type='primary'
        className='w-full'
        size='large'
        onClick={handleSave}
        loading={loading}
        // disabled={displayDepositAmount() > 0}
      >
        Save
      </Button>
    </Drawer>
  );
}
