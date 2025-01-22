'use client';

import { TWalletInfo } from '@aelf-web-login/wallet-adapter-base';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import type { CheckboxProps, CollapseProps } from 'antd';
import {
  Button,
  Checkbox,
  Col,
  Collapse,
  Divider,
  Drawer,
  InputNumber,
  Row,
} from 'antd';
import { MessageInstance } from 'antd/es/message/interface';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import {
  handleErrorMessage,
  isValidJSON,
  timesDecimals,
  useDebounceCallback,
} from '@/lib/utils';

import ConnectWalletFirst from '@/components/wallet/ConnectWalletFirst';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setOrgBalance } from '@/store/slices/commonSlice';

import {
  assetsRelate,
  cancelOrder,
  getOrgBalance,
  order,
  payOrder,
  watchOrdersCost,
} from '@/api/requestMarket';
import { getAssetsList, getMerchandisesList } from '@/api/requestMarket';
import { AeFinderContractAddress, CHAIN_ID } from '@/constant';

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

  const { callSendMethod, isConnected, walletInfo } = useConnectWallet();

  const [isShowFreeSelect, setIsShowFreeSelect] = useState(false);
  const [currentFreeSelected, setCurrentFreeSelected] =
    useState<boolean>(false);
  const [freeProcessor, setFreeProcessor] = useState<AssetsItem>();
  const [freeStorage, setFreeStorage] = useState<AssetsItem>();

  const [isShowCapacityCollapse, setIsShowCapacityCollapse] = useState(false);
  const [loading, setLoading] = useState(false);
  const orgUser = useAppSelector((state) => state.common.orgUser);
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

  const walletInfoRef = useRef<TWalletInfo>();
  walletInfoRef.current = walletInfo;
  const isConnectedRef = useRef<boolean>();
  isConnectedRef.current = isConnected;

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
    if (!currentAppDetail?.appId) return;
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
      setCurrentCapacityType(asset?.merchandise?.specification);
      setOriginalCapacityType(asset?.merchandise?.specification);
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

  const getFreeAssetsTemp = useCallback(async () => {
    if (!currentAppDetail?.appId) {
      return;
    }
    // step:1 checkout asset list length is 0
    const getResourceAssetListRes = await getAssetsList({
      appId: currentAppDetail?.appId,
      category: 1, // 1: Resource
      skipCount: 0,
      maxResultCount: 100,
    });
    console.log('getResourceAssetListRes', getResourceAssetListRes);
    // step:2 checkout has free asset list length is 2
    const getFreeResourceAssetListRes = await getAssetsList({
      isFree: true,
      category: 1,
      skipCount: 0,
      maxResultCount: 100,
    });
    console.log('getFreeResourceAssetListRes', getFreeResourceAssetListRes);
    if (
      getResourceAssetListRes?.totalCount === 0 &&
      getFreeResourceAssetListRes?.totalCount === 2
    ) {
      setIsShowFreeSelect(true);
      getFreeResourceAssetListRes?.items?.map((item) => {
        if (item?.merchandise?.name === 'Processor') {
          setFreeProcessor(item);
        }
        if (item?.merchandise?.name === 'Storage') {
          setFreeStorage(item);
        }
      });
    }
    // eslint-disable-next-line
  }, [currentAppDetail?.appId, isShowUpdateCapacityModal]);

  useEffect(() => {
    getFreeAssetsTemp();
  }, [getFreeAssetsTemp]);

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
      (item) => item.specification === currentCapacityType
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

  const onCollapseChange: CollapseProps['onChange'] = (key) => {
    console.log(key);
    setIsShowCapacityCollapse((pre) => !pre);
  };

  const handleClose = useCallback(() => {
    setIsShowUpdateCapacityModal(false);
  }, [setIsShowUpdateCapacityModal]);

  const handlePreCreateOrder = useCallback(async () => {
    const currentProcessMerchandise = processMerchandisesList.find(
      (item) => item.specification === currentCapacityType
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
    if (billingId && billingAmount === 0) {
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
        chainId: CHAIN_ID,
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

  const onFreeSelectChange: CheckboxProps['onChange'] = (e) => {
    console.log(`checked = ${e?.target?.checked}`);
    setCurrentFreeSelected(e?.target?.checked);
    // 1 if select free, set capacity and storage as free
    // 2 or set capacity and storage as original
    if (e?.target?.checked) {
      if (freeProcessor?.merchandise?.specification) {
        setCurrentCapacityType(freeProcessor?.merchandise?.specification);
      }
      if (freeStorage?.replicas) {
        setCurrentStorageNum(freeStorage?.replicas);
      }
    } else {
      setCurrentCapacityType(currentCapacityType);
      setCurrentStorageNum(currentStorageNum);
    }
  };

  const handleRelateAssets = useCallback(async () => {
    if (!freeProcessor?.id || !freeStorage?.id) {
      messageApi.warning('Please select the capacity and storage capacity');
      return;
    }
    try {
      setLoading(true);
      const assetsRelateRes = await assetsRelate({
        appId: currentAppDetail?.appId,
        assetIds: [freeProcessor?.id, freeStorage?.id],
      });
      console.log('assetsRelateRes', assetsRelateRes);
      if (assetsRelateRes) {
        messageApi.success('Relate assets successfully');
        handleClose();
      }
    } finally {
      setLoading(false);
    }
  }, [
    currentAppDetail?.appId,
    freeProcessor?.id,
    freeStorage?.id,
    messageApi,
    handleClose,
  ]);

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
                  {item?.specification}
                </Col>
                <Col span={6} className='text-gray-80 text-sm'>
                  {item?.price}
                </Col>
                <Col span={7} className='text-gray-80 text-sm'>
                  {isValidJSON(item?.description)
                    ? JSON.parse(item?.description)?.cpu
                    : '--'}
                </Col>
                <Col span={6} className='text-gray-80 text-sm'>
                  {isValidJSON(item?.description)
                    ? JSON.parse(item?.description)?.memory
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
      title='Set Capacity'
      placement='right'
      onClose={handleClose}
      open={isShowUpdateCapacityModal}
    >
      {isShowFreeSelect && (
        <Checkbox
          className='mb-[20px]'
          onChange={onFreeSelectChange}
          value={currentFreeSelected}
        >
          Use free capacity
        </Checkbox>
      )}
      <Collapse items={items} onChange={onCollapseChange} />
      <div className='text-dark-normal mb-[10px] mt-[24px]'>
        Processor Capacity:
      </div>
      <div className='mb-[20px] flex items-center justify-between'>
        {processMerchandisesList?.map((item) => {
          return (
            <Button
              key={item?.id}
              type={
                currentCapacityType === item.specification
                  ? 'primary'
                  : 'default'
              }
              className='w-[30%]'
              onClick={() => setCurrentCapacityType(item.specification)}
              disabled={isProcessLocked || currentFreeSelected}
            >
              {item.specification}
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
          disabled={isStorageLocked || currentFreeSelected}
        />
      </div>
      {currentTotalActualAmount > orgBalance?.balance &&
        !currentFreeSelected && (
          <div className='border-gray-E0 mb-[24px] rounded-lg border px-[9px] py-[12px]'>
            <div className='text-sm'>
              You currently do not have enough balance to create the AeIndexer.
              To proceed,
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
          <span className='text-gray-80 text-sm'>Balance</span>
          <span className='text-dark-normal'>{orgBalance?.balance} USDT</span>
        </div>
        <div className='mt-[10px] flex items-center justify-between'>
          <span className='text-gray-80 text-sm'>Locked</span>
          <span className='text-dark-normal'>
            {orgBalance?.lockedBalance} USDT
          </span>
        </div>
        {originalCapacityType !== currentCapacityType &&
          !currentFreeSelected && (
            <div>
              <Divider className='my-[20px]' />
              <div className='flex justify-between'>
                <div className='text-gray-80 text-sm'>Processor</div>
                <div className='text-dark-normal'>
                  {currentProcessAmount} USDT
                </div>
              </div>
              <div className='mt-[20px] flex justify-between'>
                <div className='text-gray-80 text-sm'>Deduction Amount</div>
                <div className='text-dark-normal'>
                  {currentProcessDeductionAmount} USDT
                </div>
              </div>
              <div className='mt-[20px] flex justify-between'>
                <div className='text-dark-normal'>Actual Amount</div>
                <div className='text-dark-normal'>
                  {currentProcessActualAmount} USDT
                </div>
              </div>
            </div>
          )}
        {originalStorageNum !== currentStorageNum && !currentFreeSelected && (
          <div>
            <Divider className='my-[20px]' />
            <div className='flex justify-between'>
              <div className='text-gray-80 text-sm'>Storage</div>
              <div className='text-dark-normal'>
                {currentStorageAmount} USDT
              </div>
            </div>
            <div className='mt-[20px] flex justify-between'>
              <div className='text-gray-80 text-sm'>Deduction Amount</div>
              <div className='text-dark-normal'>
                {currentStorageDeductionAmount} USDT
              </div>
            </div>
            <div className='mt-[20px] flex justify-between'>
              <div className='text-dark-normal'>Actual Amount</div>
              <div className='text-dark-normal'>
                {currentStorageActualAmount} USDT
              </div>
            </div>
          </div>
        )}
        {(originalCapacityType !== currentCapacityType ||
          originalStorageNum !== currentStorageNum) &&
          !currentFreeSelected && (
            <div>
              <Divider className='my-[20px]' />
              <div className='flex justify-between'>
                <div className='text-gray-80 text-sm'>Total Amount</div>
                <div className='text-dark-normal'>
                  {currentTotalAmount} USDT
                </div>
              </div>
              <div className='mt-[20px] flex justify-between'>
                <div className='text-gray-80 text-sm'>
                  Total Deduction Amount
                </div>
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
        {currentFreeSelected && (
          <div>
            <Divider className='my-[20px]' />
            <div className='mt-[20px] flex justify-between'>
              <div className='text-dark-normal'>Total Amount</div>
              <div className='text-dark-normal'>0 USDT</div>
            </div>
          </div>
        )}
      </div>
      {isConnectedRef.current &&
        walletInfoRef.current &&
        !currentFreeSelected && (
          <Button
            type='primary'
            className='mt-[24px] w-full'
            size='large'
            onClick={handleSave}
            loading={loading}
            disabled={
              (originalCapacityType === currentCapacityType &&
                originalStorageNum === currentStorageNum) ||
              orgUser?.organizationStatus === 1
            }
          >
            Save
          </Button>
        )}
      {(!isConnectedRef.current || !walletInfoRef.current) &&
        !currentFreeSelected && (
          <ConnectWalletFirst
            classNames='w-full mt-[24px]'
            messageApi={messageApi}
          />
        )}
      {currentFreeSelected && (
        <Button
          type='primary'
          className='mt-[24px] w-full'
          size='large'
          onClick={handleRelateAssets}
          loading={loading}
        >
          Save
        </Button>
      )}
      <Divider className='my-[24px]' />
      {currentFreeSelected && (
        <div className='text-gray-80 mt-[24px] text-sm'>
          Note: Your free trial of AeIndexer is active for 7 days. After that it
          will be deactivated.
        </div>
      )}
      <div
        className={clsx(
          'text-gray-80 text-sm',
          currentFreeSelected ? 'mt-[10px]' : 'mt-[24px]'
        )}
      >
        The current prices are promotional and available for a limited time
        only.
      </div>
      <div className='text-gray-80 mt-[10px] text-sm'>
        Processor Amount = (The remaining hours of the current month) * price.
      </div>
      <div className='text-gray-80 mt-[10px] text-sm'>
        *This amount will remain locked in your Balance and be charged at the
        end of the month.
      </div>
    </Drawer>
  );
}
