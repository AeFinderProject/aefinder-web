'use client';

import { LeftOutlined } from '@ant-design/icons';
import { Col, Divider, Row, Tag } from 'antd';
import dayjs from 'dayjs';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';

import { displayUnit, useDebounceCallback } from '@/lib/utils';

import Copy from '@/components/Copy';

import { queryAuthToken } from '@/api/apiUtils';
import { getOrdersDetail } from '@/api/requestMarket';

export default function OrderDetail() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [orderId, setOrderId] = useState('');
  const [currentOrderDetail, setCurrentOrderDetail] = useState(null);
  const [originResources, setOriginResources] = useState([]);
  const [currentResources, setCurrentResources] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!orderId) {
        setOrderId(searchParams.get('orderId') || '');
      } else {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [orderId, searchParams]);

  const getAppDetailTemp = useDebounceCallback(async () => {
    await queryAuthToken();
    if (!orderId) {
      return;
    }
    const res = await getOrdersDetail({ id: String(orderId) });
    console.log('res', res);
    if (typeof res === 'object' && res?.id) {
      setCurrentOrderDetail(res);
    }
  }, [orderId]);

  useEffect(() => {
    getAppDetailTemp();
  }, [getAppDetailTemp]);

  const handleRouteBack = useCallback(() => {
    setOrderId('');
    setCurrentOrderDetail(null);
    setOriginResources([]);
    setCurrentResources([]);
    router.back();
  }, [router, setCurrentOrderDetail]);

  useEffect(() => {
    if (currentOrderDetail?.details?.length === 0) {
      setOriginResources([]);
      setCurrentResources([]);
      return;
    }
    const tempOriginResources = [];
    const tempCurrentResources = [];
    currentOrderDetail?.details?.map((item) => {
      if (item?.originalAsset) {
        tempOriginResources.push({
          name: item?.originalAsset?.merchandise?.name,
          price: item?.originalAsset?.merchandise?.price,
          unit: item?.originalAsset?.merchandise?.unit,
          type: item?.originalAsset?.merchandise?.type,
          chargeType: item?.originalAsset?.merchandise?.chargeType,
          specification: item?.originalAsset?.merchandise?.specification,
          quantity: item?.originalAsset?.quantity,
          replicas: item?.originalAsset?.replicas,
          appId:
            item?.originalAsset?.appId ||
            currentOrderDetail?.extraData?.RelateAppId,
        });
      }
      tempCurrentResources.push({
        name: item?.merchandise?.name,
        price: item?.merchandise?.price,
        unit: item?.merchandise?.unit,
        type: item?.merchandise?.type,
        chargeType: item?.merchandise?.chargeType,
        specification: item?.merchandise?.specification,
        quantity: item?.quantity,
        replicas: item?.replicas,
        appId:
          item?.originalAsset?.appId ||
          currentOrderDetail?.extraData?.RelateAppId,
      });
    });
    setOriginResources(tempOriginResources);
    setCurrentResources(tempCurrentResources);
  }, [currentOrderDetail]);

  return (
    <div className='px-[16px] pb-[36px] sm:px-[40px]'>
      <div className='border-gray-F0 flex h-[120px] flex-col items-start justify-center border-b'>
        <div>
          <LeftOutlined
            className='relative top-[-7px] mr-[16px] cursor-pointer align-middle text-sm'
            onClick={handleRouteBack}
          />
          <span className='text-3xl text-black'>Order Details</span>
        </div>
      </div>
      <div>
        <div className='text-dark-normal mb-[12px] mt-[24px] text-xl font-medium'>
          Order overview
        </div>
        <div className='bg-gray-F5 w-full rounded-lg px-[24px] py-[12px]'>
          <Row gutter={24}>
            <Col xs={12} md={6} className='my-[12px]'>
              <Copy
                label='Order Id'
                content={currentOrderDetail?.id}
                isShowCopy={true}
                showLittle={true}
              />
            </Col>
            <Col xs={12} md={6} className='my-[12px]'>
              <div className='text-gray-80 mb-[10px] text-xs'>Amount</div>
              {String(currentOrderDetail?.amount)} USDT
            </Col>
            <Col xs={12} md={6} className='my-[12px]'>
              <div className='text-gray-80 mb-[10px] text-xs'>
                Deduction Amount
              </div>
              {String(currentOrderDetail?.deductionAmount)} USDT
            </Col>
            <Col xs={12} md={6} className='my-[12px]'>
              <div className='text-gray-80 mb-[10px] text-xs'>
                Actual Amount
              </div>
              {String(currentOrderDetail?.actualAmount)} USDT
            </Col>
          </Row>
          <Row gutter={24}>
            <Col xs={12} md={6} className='my-[12px]'>
              <div className='text-gray-80 mb-[10px] text-xs'>Status</div>
              <div>
                {currentOrderDetail?.status === 0 && (
                  <Tag color='volcano'>Unpaid</Tag>
                )}
                {currentOrderDetail?.status === 1 && (
                  <Tag color='processing'>Payment Pending</Tag>
                )}
                {currentOrderDetail?.status === 2 && (
                  <Tag color='success'>Payment Confirmed</Tag>
                )}
                {currentOrderDetail?.status === 3 && (
                  <Tag color='orange'>Canceled</Tag>
                )}
                {currentOrderDetail?.status === 4 && (
                  <Tag color='red'>Payment Failed</Tag>
                )}
              </div>
            </Col>
            <Col xs={12} md={6} className='my-[12px]'>
              <div className='text-gray-80 mb-[10px] text-xs'>Payment Type</div>
              <div>
                {currentOrderDetail?.paymentType === 0 && (
                  <Tag color='warning'>--</Tag>
                )}
                {currentOrderDetail?.paymentType === 1 && (
                  <Tag color='success'>Wallet Pay</Tag>
                )}
              </div>
            </Col>
            <Col xs={12} md={6} className='my-[12px]'>
              <div className='text-gray-80 mb-[10px] text-xs'>Order Time</div>
              <div>
                {dayjs(currentOrderDetail?.orderTime).format(
                  'YYYY/MM/DD HH:mm:ss'
                )}
              </div>
            </Col>
            <Col xs={12} md={6} className='my-[12px]'>
              <div className='text-gray-80 mb-[10px] text-xs'>Payment Time</div>
              <div>
                {dayjs(currentOrderDetail?.paymentTime).format(
                  'YYYY/MM/DD HH:mm:ss'
                )}
              </div>
            </Col>
          </Row>
        </div>
        {originResources?.length > 0 && (
          <div>
            <Divider className='my-[24px]' />
            <div className='text-dark-normal my-[12px] text-xl'>
              Origin Resources
            </div>
            {originResources?.map((item, index) => {
              return (
                <div key={index} className='mt-[10px]'>
                  <div className='bg-gray-F5 w-full rounded-lg px-[24px] py-[12px]'>
                    <Row gutter={24}>
                      <Col xs={12} md={6} className='my-[12px]'>
                        <div className='text-gray-80 mb-[10px] text-xs'>
                          Merchandise Name
                        </div>
                        {item?.name || '--'}
                      </Col>
                      <Col xs={12} md={6} className='my-[12px]'>
                        <div className='text-gray-80 mb-[10px] text-xs'>
                          Price
                        </div>
                        {item?.price || '--'} USDT/
                        {displayUnit(item?.chargeType, item?.type, item?.unit)}
                      </Col>
                      {item?.type === 0 && (
                        <Col xs={12} md={6} className='my-[12px]'>
                          <div className='text-gray-80 mb-[10px] text-xs'>
                            Quantity
                          </div>
                          {item?.quantity || '--'}
                        </Col>
                      )}
                      {item?.type === 1 && (
                        <Col xs={12} md={6} className='my-[12px]'>
                          <div className='text-gray-80 mb-[10px] text-xs'>
                            Type
                          </div>
                          {item?.specification || '--'}
                        </Col>
                      )}
                      {item?.type === 2 && (
                        <Col xs={12} md={6} className='my-[12px]'>
                          <div className='text-gray-80 mb-[10px] text-xs'>
                            Size
                          </div>
                          {item?.replicas || '--'}
                          {item?.unit || '--'}
                        </Col>
                      )}
                      {item?.appId && (
                        <Col xs={12} md={6} className='my-[12px]'>
                          <div className='text-gray-80 mb-[10px] text-xs'>
                            AeIndexer
                          </div>
                          {item?.appId || '--'}
                        </Col>
                      )}
                    </Row>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {currentResources?.length > 0 && (
          <div>
            <Divider className='my-[24px]' />
            <div className='text-dark-normal my-[12px] text-xl'>
              Current Resources
            </div>
            {currentResources?.map((item, index) => {
              return (
                <div key={index} className='mt-[10px]'>
                  <div className='bg-gray-F5 w-full rounded-lg px-[24px] py-[12px]'>
                    <Row gutter={24}>
                      <Col xs={12} md={6} className='my-[12px]'>
                        <div className='text-gray-80 mb-[10px] text-xs'>
                          Merchandise Name
                        </div>
                        {item?.name || '--'}
                      </Col>
                      <Col xs={12} md={6} className='my-[12px]'>
                        <div className='text-gray-80 mb-[10px] text-xs'>
                          Price
                        </div>
                        {item?.price || '--'} USDT/
                        {displayUnit(item?.chargeType, item?.type, item?.unit)}
                      </Col>
                      {item?.type === 0 && (
                        <Col xs={12} md={6} className='my-[12px]'>
                          <div className='text-gray-80 mb-[10px] text-xs'>
                            Quantity
                          </div>
                          {item?.quantity || '--'}
                        </Col>
                      )}
                      {item?.type === 1 && (
                        <Col xs={12} md={6} className='my-[12px]'>
                          <div className='text-gray-80 mb-[10px] text-xs'>
                            Type
                          </div>
                          {item?.specification || '--'}
                        </Col>
                      )}
                      {item?.type === 2 && (
                        <Col xs={12} md={6} className='my-[12px]'>
                          <div className='text-gray-80 mb-[10px] text-xs'>
                            Size
                          </div>
                          {item?.replicas || '--'}
                          {item?.unit || '--'}
                        </Col>
                      )}
                      {item?.appId && (
                        <Col xs={12} md={6} className='my-[12px]'>
                          <div className='text-gray-80 mb-[10px] text-xs'>
                            AeIndexer
                          </div>
                          {item?.appId || '--'}
                        </Col>
                      )}
                    </Row>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
