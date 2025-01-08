'use client';

import { LeftOutlined } from '@ant-design/icons';
import { Col, Row, Tag } from 'antd';
import dayjs from 'dayjs';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';

import { useDebounceCallback } from '@/lib/utils';

import Copy from '@/components/Copy';

import { queryAuthToken } from '@/api/apiUtils';
import { getOrdersDetail } from '@/api/requestMarket';

export default function OrderDetail() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [orderId, setOrderId] = useState('');
  const [currentOrderDetail, setCurrentOrderDetail] = useState(null);

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
    if (orderId) {
      const res = await getOrdersDetail({ id: String(orderId) });
      console.log('res', res);
      if (typeof res === 'object' && res?.id) {
        setCurrentOrderDetail(res);
      }
    }
  }, [orderId]);

  useEffect(() => {
    getAppDetailTemp();
  }, [getAppDetailTemp]);

  const handleRouteBack = useCallback(() => {
    setOrderId('');
    setCurrentOrderDetail(null);
    router.back();
  }, [router, setCurrentOrderDetail]);

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
        <div className='bg-gray-F5 w-full rounded-lg p-[24px]'>
          <Row gutter={24}>
            <Col xs={12} md={6}>
              <Copy
                label='Order Id'
                content={currentOrderDetail?.id}
                isShowCopy={true}
                showLittle={true}
              />
            </Col>
            <Col xs={12} md={6}>
              <div className='text-gray-80 mb-[10px] text-xs'>Amount</div>
              {String(currentOrderDetail?.amount)} USDT
            </Col>
            <Col xs={12} md={6}>
              <div className='text-gray-80 mb-[10px] mt-[24px] text-xs sm:mt-[0px]'>
                DeductionAmount
              </div>
              {String(currentOrderDetail?.deductionAmount)} USDT
            </Col>
            <Col xs={12} md={6}>
              <div className='text-gray-80 mb-[10px] mt-[24px] text-xs sm:mt-[0px]'>
                ActualAmount
              </div>
              {String(currentOrderDetail?.actualAmount)} USDT
            </Col>
          </Row>
          <Row gutter={24} className='mt-[24px]'>
            <Col xs={12} md={6}>
              <div className='text-gray-80 mb-[10px] text-xs'>Status</div>
              <div>
                {currentOrderDetail?.status === 0 && (
                  <Tag color='volcano'>Unpaid</Tag>
                )}
                {currentOrderDetail?.status === 1 && (
                  <Tag color='processing'>PaymentPending</Tag>
                )}
                {currentOrderDetail?.status === 2 && (
                  <Tag color='success'>PaymentConfirmed</Tag>
                )}
                {currentOrderDetail?.status === 3 && (
                  <Tag color='orange'>Canceled</Tag>
                )}
                {currentOrderDetail?.status === 4 && (
                  <Tag color='red'>PaymentFailed</Tag>
                )}
              </div>
            </Col>
            <Col xs={12} md={6}>
              <div className='text-gray-80 mb-[10px] text-xs'>PaymentType</div>
              <div>
                {currentOrderDetail?.paymentType === 0 && (
                  <Tag color='warning'>--</Tag>
                )}
                {currentOrderDetail?.paymentType === 1 && (
                  <Tag color='success'>WalletPay</Tag>
                )}
              </div>
            </Col>
            <Col xs={12} md={6}>
              <div className='text-gray-80 mb-[10px] mt-[24px] text-xs sm:mt-[0px]'>
                OrderTime
              </div>
              <div>
                {dayjs(currentOrderDetail?.orderTime).format(
                  'YYYY/MM/DD HH:mm:ss'
                )}
              </div>
            </Col>
            <Col xs={12} md={6}>
              <div className='text-gray-80 mb-[10px] mt-[24px] text-xs sm:mt-[0px]'>
                PaymentTime
              </div>
              <div>
                {dayjs(currentOrderDetail?.paymentTime).format(
                  'YYYY/MM/DD HH:mm:ss'
                )}
              </div>
            </Col>
          </Row>
        </div>
        {currentOrderDetail?.details?.length > 0 &&
          currentOrderDetail?.details?.map((item, index) => {
            return (
              <div key={index}>
                {item?.originalAsset?.id && (
                  <div>
                    <div className='text-dark-normal mb-[12px] mt-[24px] text-xl'>
                      Original Asset
                    </div>
                    <div className='bg-gray-F5 w-full rounded-lg p-[24px]'>
                      <Row gutter={24}>
                        <Col xs={12} md={6}>
                          <Copy
                            label='Order Id'
                            content={item?.originalAsset?.id}
                            isShowCopy={true}
                            showLittle={true}
                          />
                        </Col>
                        <Col xs={12} md={6}>
                          <div className='text-gray-80 mb-[10px] text-xs'>
                            PaidAmount
                          </div>
                          {String(item?.originalAsset?.paidAmount)} USDT
                        </Col>
                        <Col xs={12} md={6}>
                          <div className='text-gray-80 mb-[10px] mt-[24px] text-xs sm:mt-[0px]'>
                            FreeQuantity
                          </div>
                          {item?.originalAsset?.freeQuantity || '--'}
                        </Col>
                        <Col xs={12} md={6}>
                          <div className='text-gray-80 mb-[10px] mt-[24px] text-xs sm:mt-[0px]'>
                            Quantity
                          </div>
                          {item?.originalAsset?.quantity || '--'}
                        </Col>
                      </Row>
                      <Row gutter={24} className='mt-[24px]'>
                        <Col xs={12} md={6}>
                          <div className='text-gray-80 mb-[10px] text-xs'>
                            FreeReplicas
                          </div>
                          {item?.originalAsset?.freeReplicas || '--'}
                        </Col>
                        <Col xs={12} md={6}>
                          <div className='text-gray-80 mb-[10px] text-xs'>
                            Replicas
                          </div>
                          {item?.originalAsset?.replicas || '--'}
                        </Col>
                        <Col xs={12} md={6}>
                          <div className='text-gray-80 mb-[10px] mt-[24px] text-xs sm:mt-[0px]'>
                            AeIndexer
                          </div>
                          {item?.originalAsset?.appId || '--'}
                        </Col>
                        <Col xs={12} md={6}>
                          <div className='text-gray-80 mb-[10px] mt-[24px] text-xs sm:mt-[0px]'>
                            isLocked
                          </div>
                          {String(item?.originalAsset?.isLocked)}
                        </Col>
                      </Row>
                      <Row gutter={24} className='mt-[24px]'>
                        <Col xs={12} md={6}>
                          <div className='text-gray-80 mb-[10px] text-xs'>
                            Status
                          </div>
                          <div>
                            {item?.originalAsset?.status === 0 && (
                              <Tag color='volcano'>Unpaid</Tag>
                            )}
                            {item?.originalAsset?.status === 1 && (
                              <Tag color='processing'>PaymentPending</Tag>
                            )}
                            {item?.originalAsset?.status === 2 && (
                              <Tag color='success'>PaymentConfirmed</Tag>
                            )}
                            {item?.originalAsset?.status === 3 && (
                              <Tag color='orange'>Canceled</Tag>
                            )}
                            {item?.originalAsset?.status === 4 && (
                              <Tag color='red'>PaymentFailed</Tag>
                            )}
                          </div>
                        </Col>
                        <Col xs={12} md={6}>
                          <div className='text-gray-80 mb-[10px] text-xs'>
                            createTime
                          </div>
                          {dayjs(item?.originalAsset?.createTime).format(
                            'YYYY/MM/DD HH:mm:ss'
                          )}
                        </Col>
                        <Col xs={12} md={6}>
                          <div className='text-gray-80 mb-[10px] mt-[24px] text-xs sm:mt-[0px]'>
                            StartTime
                          </div>
                          {dayjs(item?.originalAsset?.startTime).format(
                            'YYYY/MM/DD HH:mm:ss'
                          )}
                        </Col>
                        <Col xs={12} md={6}>
                          <div className='text-gray-80 mb-[10px] mt-[24px] text-xs sm:mt-[0px]'>
                            EndTime
                          </div>
                          {dayjs(item?.originalAsset?.endTime).format(
                            'YYYY/MM/DD HH:mm:ss'
                          )}
                        </Col>
                      </Row>
                    </div>
                  </div>
                )}
                <div>
                  <div className='text-dark-normal mb-[12px] mt-[24px] text-xl'>
                    Existing Assets
                  </div>
                  <div className='bg-gray-F5 w-full  rounded-lg p-[24px]'>
                    <Row gutter={24}>
                      <Col xs={12} md={6}>
                        <div className='text-gray-80 mb-[10px] text-xs'>
                          Merchandise Name
                        </div>
                        {item?.merchandise?.name || '--'}
                      </Col>
                      <Col xs={12} md={6}>
                        <div className='text-gray-80 mb-[10px] text-xs'>
                          Description
                        </div>
                        {item?.merchandise?.description || '--'}
                      </Col>
                      <Col xs={12} md={6}>
                        <div className='text-gray-80 mb-[10px] mt-[24px] text-xs sm:mt-[0px]'>
                          Quantity
                        </div>
                        {item?.quantity || '--'}
                      </Col>
                      <Col xs={12} md={6}>
                        <div className='text-gray-80 mb-[10px] mt-[24px] text-xs sm:mt-[0px]'>
                          Replicas
                        </div>
                        {item?.replicas || '--'}
                      </Col>
                    </Row>
                    <Row gutter={24} className='mt-[24px]'>
                      <Col xs={12} md={6}>
                        <div className='text-gray-80 mb-[10px] text-xs'>
                          Price
                        </div>
                        {item?.merchandise?.price || '--'} USDT
                      </Col>
                      <Col xs={12} md={6}>
                        <div className='text-gray-80 mb-[10px] text-xs'>
                          Amount
                        </div>
                        {String(item?.amount)} USDT
                      </Col>
                      <Col xs={12} md={6}>
                        <div className='text-gray-80 mb-[10px] mt-[24px] text-xs sm:mt-[0px]'>
                          DeductionAmount
                        </div>
                        {String(item?.deductionAmount)} USDT
                      </Col>
                      <Col xs={12} md={6}>
                        <div className='text-gray-80 mb-[10px] mt-[24px] text-xs sm:mt-[0px]'>
                          ActualAmount
                        </div>
                        {String(item?.actualAmount)} USDT
                      </Col>
                    </Row>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
