'use client';

import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import type { CollapseProps } from 'antd';
import { Button, Col, Collapse, Divider, Drawer, Row } from 'antd';
import { MessageInstance } from 'antd/es/message/interface';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import {
  handleErrorMessage,
  timesDecimals,
  useDebounceCallback,
  useThrottleCallback,
} from '@/lib/utils';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setOrgUserAll } from '@/store/slices/appSlice';
import { setOrgBalance } from '@/store/slices/commonSlice';

import {
  cancelPayment,
  createOrder,
  getOrgBalance,
  getOrgUserAll,
  getResourcesLevel,
  pendingPayment,
  resourceBillPlan,
} from '@/api/requestMarket';
import { AeFinderContractAddress } from '@/constant';

import { ApproveResponseType } from '@/types/appType';
import {
  ResourceBillPlanResponse,
  ResourcesLevelItem,
} from '@/types/marketType';

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
  const [resourcesLevelList, setResourcesLevelList] = useState<
    ResourcesLevelItem[]
  >([]);
  const [currentCapacityType, setCurrentCapacityType] = useState('Small');
  const [currentCapacity, setCurrentCapacity] = useState<ResourcesLevelItem>();
  const [currentResourceBillPlan, setCurrentResourceBillPlan] =
    useState<ResourceBillPlanResponse>();
  const [loading, setLoading] = useState(false);

  const orgBalance = useAppSelector((state) => state.common.orgBalance);
  const currentAppDetail = useAppSelector(
    (state) => state.app.currentAppDetail
  );

  // const resourcesLevelList = useAppSelector((state) => state.app.resourcesLevelList);
  console.log('resourcesLevelList appSlice', resourcesLevelList);

  const getResourcesLevelTemp = useThrottleCallback(async () => {
    const getResourcesLevelRes = await getResourcesLevel();
    console.log('getResourcesLevelRes drawer', getResourcesLevelRes);
    if (getResourcesLevelRes?.length > 0) {
      setResourcesLevelList(getResourcesLevelRes);
    }
  }, [isShowUpdateCapacityModal]);

  useEffect(() => {
    getResourcesLevelTemp();
  }, [getResourcesLevelTemp, isShowUpdateCapacityModal]);

  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: `${isShowCapacityCollapse ? 'Hide' : 'Show'} capacity details`,
      children: (
        <div>
          <Row gutter={24}>
            <Col span={6} className='text-gray-80 text-xs'>
              Size
            </Col>
            <Col span={6} className='text-gray-80 text-xs'>
              CPU
            </Col>
            <Col span={6} className='text-gray-80 text-xs'>
              RAM
            </Col>
            <Col span={6} className='text-gray-80 text-xs'>
              Disk
            </Col>
          </Row>
          <Divider className='my-[8px]' />
          {resourcesLevelList?.map((item) => {
            return (
              <Row gutter={24} key={item?.levelName} className='mt-[10px]'>
                <Col span={6} className='text-gray-80 text-sm'>
                  {item?.levelName}
                </Col>
                <Col span={6} className='text-gray-80 text-sm'>
                  {item?.capacity?.cpu}
                </Col>
                <Col span={6} className='text-gray-80 text-sm'>
                  {item?.capacity?.memory}
                </Col>
                <Col span={6} className='text-gray-80 text-sm'>
                  {item?.capacity?.disk} GB
                </Col>
              </Row>
            );
          })}
        </div>
      ),
    },
  ];

  const resourceBillPlanTemp = useDebounceCallback(async () => {
    let currentCapacityData: ResourcesLevelItem | undefined;
    resourcesLevelList?.map((item) => {
      if (item?.levelName === currentCapacityType) {
        currentCapacityData = item;
      }
    });
    console.log('resourcesLevelList', resourcesLevelList);
    console.log('currentCapacityData', currentCapacityData);
    if (currentCapacityData?.productId) {
      setCurrentCapacity(currentCapacityData);
      const resourceBillPlanRes = await resourceBillPlan({
        productId: currentCapacityData?.productId,
        productNum: 1,
        periodMonths: 1,
      });
      console.log('resourceBillPlanRes', resourceBillPlanRes);
      if (resourceBillPlanRes?.monthlyUnitPrice) {
        setCurrentResourceBillPlan(resourceBillPlanRes);
      }
    }
  }, [
    resourcesLevelList?.length,
    currentCapacityType,
    isShowUpdateCapacityModal,
  ]);

  useEffect(() => {
    if (resourcesLevelList?.length > 0) {
      resourceBillPlanTemp();
    }
  }, [resourceBillPlanTemp, resourcesLevelList?.length]);

  const getOrgBalanceTemp = useDebounceCallback(async () => {
    const getOrgBalanceRes = await getOrgBalance();
    console.log('getOrgBalance', getOrgBalanceRes);
    if (getOrgBalanceRes?.balance) {
      dispatch(setOrgBalance(getOrgBalanceRes));
    }
  }, [getOrgBalance]);

  const getOrgUserAllTemp = useDebounceCallback(async () => {
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

  const onChange: CollapseProps['onChange'] = (key) => {
    console.log(key);
    setIsShowCapacityCollapse((pre) => !pre);
  };

  const handleClose = useCallback(() => {
    setIsShowUpdateCapacityModal(false);
  }, [setIsShowUpdateCapacityModal]);

  const handlePreCreateOrder = useCallback(async () => {
    if (!currentCapacity?.productId) {
      return {
        billingId: '',
        billingAmount: 0,
      };
    }
    const createOrderRes = await createOrder({
      appId: currentAppDetail?.appId,
      productId: currentCapacity?.productId,
      // default 1 number 1 month
      productNumber: 1,
      periodMonths: 1,
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
  }, [currentCapacity?.productId, currentAppDetail?.appId]);

  const handleSave = useDebounceCallback(async () => {
    setLoading(true);
    const { billingId, billingAmount } = await handlePreCreateOrder();
    try {
      console.log('billingId, billingAmount', billingId, billingAmount);
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
          content: 'Successfully updated capacity',
          duration: 10,
        });
        // refresh balance when Confirm monthly purchase success
        getOrgBalanceTemp();
        await pendingPayment({
          billingId: billingId,
        });
        handleClose();
      } else {
        messageApi.open({
          type: 'info',
          content: 'Confirm monthly purchase failed',
        });
        await cancelPayment({
          billingId: billingId,
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
      await cancelPayment({
        billingId: billingId,
      });
    } finally {
      setLoading(false);
    }
  }, [messageApi, handleClose, handlePreCreateOrder]);

  const displayDepositAmount = useCallback(() => {
    const tempAmount =
      (currentResourceBillPlan?.firstMonthCost || 0) -
      (orgBalance?.balance || 0);
    if (tempAmount > 0) {
      return tempAmount;
    } else {
      return 0;
    }
  }, [orgBalance?.balance, currentResourceBillPlan?.firstMonthCost]);

  return (
    <Drawer
      title='Update Capacity'
      placement='right'
      onClose={handleClose}
      open={isShowUpdateCapacityModal}
    >
      <Collapse items={items} onChange={onChange} />
      <div className='text-dark-normal mb-[10px] mt-[24px]'>
        AeIndexer Capacity:
      </div>
      <div className='mb-[20px] flex items-center justify-between'>
        <Button
          type={currentCapacityType === 'Small' ? 'primary' : 'default'}
          className='w-[30%]'
          size='large'
          onClick={() => setCurrentCapacityType('Small')}
        >
          Small
        </Button>
        <Button
          type={currentCapacityType === 'Medium' ? 'primary' : 'default'}
          className='w-[30%]'
          size='large'
          onClick={() => setCurrentCapacityType('Medium')}
        >
          Medium
        </Button>
        <Button
          type={currentCapacityType === 'Large' ? 'primary' : 'default'}
          className='w-[30%]'
          size='large'
          onClick={() => setCurrentCapacityType('Large')}
        >
          Large
        </Button>
      </div>
      {/* <div className='text-blue-link my-[24px] cursor-pointer text-sm'>
        Learn more about full pod and query pod.
      </div> */}
      {displayDepositAmount() > 0 && (
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
            {currentResourceBillPlan?.monthlyUnitPrice} USDT/month
          </span>
        </div>
        <div className='flex items-center justify-between'>
          <span className='text-gray-80 text-sm'>First Month Cost*</span>
          <span className='text-dark-normal'>
            {currentResourceBillPlan?.firstMonthCost?.toFixed(2)} USDT
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
        <div className='flex items-center justify-between'>
          <span className='text-dark-normal'>Required deposit</span>
          <span className='text-dark-normal'>
            {displayDepositAmount()?.toFixed(2)} USDT
          </span>
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
        disabled={displayDepositAmount() > 0}
      >
        Save
      </Button>
    </Drawer>
  );
}
