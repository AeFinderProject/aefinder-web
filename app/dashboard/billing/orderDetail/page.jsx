'use client';

import { LeftOutlined } from '@ant-design/icons';
import { Col, Divider, Row, Tag } from 'antd';
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
        {currentOrderDetail?.details?.length > 0 &&
          currentOrderDetail?.details?.map((item, index) => {
            return (
              <div key={index}>
                <Divider className='my-[24px]' />
                {item?.originalAsset?.id && (
                  <div>
                    <div className='text-dark-normal my-[12px] text-xl'>
                      Original Asset
                    </div>
                    <div className='bg-gray-F5 w-full rounded-lg px-[24px] py-[12px]'>
                      <Row gutter={24}>
                        <Col xs={12} md={6} className='my-[12px]'>
                          <Copy
                            label='Order Id'
                            content={item?.originalAsset?.id}
                            isShowCopy={true}
                            showLittle={true}
                          />
                        </Col>
                        <Col xs={12} md={6} className='my-[12px]'>
                          <div className='text-gray-80 mb-[10px] text-xs'>
                            Paid Amount
                          </div>
                          {String(item?.originalAsset?.paidAmount)} USDT
                        </Col>
                        <Col xs={12} md={6} className='my-[12px]'>
                          <div className='text-gray-80 mb-[10px] text-xs'>
                            Free Quantity
                          </div>
                          {item?.originalAsset?.freeQuantity || '--'}
                        </Col>
                        <Col xs={12} md={6} className='my-[12px]'>
                          <div className='text-gray-80 mb-[10px] text-xs'>
                            Quantity
                          </div>
                          {item?.originalAsset?.quantity || '--'}
                        </Col>
                      </Row>
                      <Row gutter={24}>
                        <Col xs={12} md={6} className='my-[12px]'>
                          <div className='text-gray-80 mb-[10px] text-xs'>
                            Free Replicas
                          </div>
                          {item?.originalAsset?.freeReplicas || '--'}
                        </Col>
                        <Col xs={12} md={6} className='my-[12px]'>
                          <div className='text-gray-80 mb-[10px] text-xs'>
                            Replicas
                          </div>
                          {item?.originalAsset?.replicas || '--'}
                        </Col>
                        <Col xs={12} md={6} className='my-[12px]'>
                          <div className='text-gray-80 mb-[10px] text-xs'>
                            AeIndexer
                          </div>
                          {item?.originalAsset?.appId || '--'}
                        </Col>
                        <Col xs={12} md={6} className='my-[12px]'>
                          <div className='text-gray-80 mb-[10px] text-xs'>
                            Locked
                          </div>
                          {String(item?.originalAsset?.isLocked)}
                        </Col>
                      </Row>
                      <Row gutter={24}>
                        <Col xs={12} md={6} className='my-[12px]'>
                          <div className='text-gray-80 mb-[10px] text-xs'>
                            Status
                          </div>
                          <div>
                            {item?.originalAsset?.status === 0 && (
                              <Tag color='volcano'>Unpaid</Tag>
                            )}
                            {item?.originalAsset?.status === 1 && (
                              <Tag color='processing'>Payment Pending</Tag>
                            )}
                            {item?.originalAsset?.status === 2 && (
                              <Tag color='success'>Payment Confirmed</Tag>
                            )}
                            {item?.originalAsset?.status === 3 && (
                              <Tag color='orange'>Canceled</Tag>
                            )}
                            {item?.originalAsset?.status === 4 && (
                              <Tag color='red'>Payment Failed</Tag>
                            )}
                          </div>
                        </Col>
                        <Col xs={12} md={6} className='my-[12px]'>
                          <div className='text-gray-80 mb-[10px] text-xs'>
                            create Time
                          </div>
                          {dayjs(item?.originalAsset?.createTime).format(
                            'YYYY/MM/DD HH:mm:ss'
                          )}
                        </Col>
                        <Col xs={12} md={6} className='my-[12px]'>
                          <div className='text-gray-80 mb-[10px] text-xs'>
                            Start Time
                          </div>
                          {dayjs(item?.originalAsset?.startTime).format(
                            'YYYY/MM/DD HH:mm:ss'
                          )}
                        </Col>
                        <Col xs={12} md={6} className='my-[12px]'>
                          <div className='text-gray-80 mb-[10px] text-xs'>
                            End Time
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
                  <div className='text-dark-normal my-[12px] text-xl'>
                    Existing Assets
                  </div>
                  <div className='bg-gray-F5 w-full  rounded-lg px-[24px] py-[12px]'>
                    <Row gutter={24}>
                      <Col xs={12} md={6} className='my-[12px]'>
                        <div className='text-gray-80 mb-[10px] text-xs'>
                          Merchandise Name
                        </div>
                        {item?.merchandise?.name || '--'}
                      </Col>
                      <Col xs={12} md={6} className='my-[12px]'>
                        <div className='text-gray-80 mb-[10px] text-xs'>
                          Description
                        </div>
                        {item?.merchandise?.description || '--'}
                      </Col>
                      <Col xs={12} md={6} className='my-[12px]'>
                        <div className='text-gray-80 mb-[10px] text-xs'>
                          Quantity
                        </div>
                        {item?.quantity || '--'}
                      </Col>
                      <Col xs={12} md={6} className='my-[12px]'>
                        <div className='text-gray-80 mb-[10px] text-xs'>
                          Replicas
                        </div>
                        {item?.replicas || '--'}
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col xs={12} md={6} className='my-[12px]'>
                        <div className='text-gray-80 mb-[10px] text-xs'>
                          Price
                        </div>
                        {item?.merchandise?.price || '--'} USDT
                      </Col>
                      <Col xs={12} md={6} className='my-[12px]'>
                        <div className='text-gray-80 mb-[10px] text-xs'>
                          Amount
                        </div>
                        {String(item?.amount)} USDT
                      </Col>
                      <Col xs={12} md={6} className='my-[12px]'>
                        <div className='text-gray-80 mb-[10px] text-xs'>
                          Deduction Amount
                        </div>
                        {String(item?.deductionAmount)} USDT
                      </Col>
                      <Col xs={12} md={6} className='my-[12px]'>
                        <div className='text-gray-80 mb-[10px] text-xs'>
                          Actual Amount
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
