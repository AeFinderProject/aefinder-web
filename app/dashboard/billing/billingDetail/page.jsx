'use client';

import { LeftOutlined } from '@ant-design/icons';
import { Col, Row, Tag } from 'antd';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';

import { useDebounceCallback } from '@/lib/utils';

import Copy from '@/components/Copy';

import { queryAuthToken } from '@/api/apiUtils';
import { getBillingsDetail } from '@/api/requestMarket';

import { BillingType } from '@/types/marketType';

export default function BillingDetail() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [billingId, setBillingId] = useState('');
  const [currentBillingDetail, setCurrentBillingDetail] = useState(null);

  console.log('currentBillingDetail', currentBillingDetail);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!billingId) {
        setBillingId(searchParams.get('billingId') || '');
      } else {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [billingId, searchParams]);

  const getAppDetailTemp = useDebounceCallback(async () => {
    await queryAuthToken();
    if (billingId) {
      const res = await getBillingsDetail({ id: String(billingId) });
      setCurrentBillingDetail(res);
    }
  }, [billingId]);

  useEffect(() => {
    getAppDetailTemp();
  }, [getAppDetailTemp]);

  const handleRouteBack = useCallback(() => {
    setBillingId('');
    setCurrentBillingDetail(null);
    router.back();
  }, [router, setCurrentBillingDetail]);

  return (
    <div className='px-[16px] pb-[36px] sm:px-[40px]'>
      <div className='border-gray-F0 flex h-[120px] flex-col items-start justify-center border-b'>
        <div>
          <LeftOutlined
            className='relative top-[-7px] mr-[16px] cursor-pointer align-middle text-sm'
            onClick={handleRouteBack}
          />
          <span className='text-3xl text-black'>Billing Details</span>
        </div>
      </div>
      <div>
        <div className='text-dark-normal mb-[12px] mt-[24px] text-xl font-medium'>
          Order overview
        </div>
        <div className='bg-gray-F5 w-full rounded-lg p-[24px]'>
          <Row gutter={24}>
            <Col xs={12} md={6}>
              <div className='text-gray-80 mb-[10px] text-xs'>RefundAmount</div>
              {String(currentBillingDetail?.refundAmount)} USDT
            </Col>
            <Col xs={12} md={6}>
              <div className='text-gray-80 mb-[10px] text-xs'>PaidAmount</div>
              {String(currentBillingDetail?.paidAmount)} USDT
            </Col>
            <Col xs={12} md={6}>
              <div className='text-gray-80 mb-[10px] mt-[24px] text-xs sm:mt-[0px]'>
                BeginTime
              </div>
              <div>
                {dayjs(currentBillingDetail?.beginTime).format(
                  'YYYY/MM/DD HH:mm:ss'
                )}
              </div>
            </Col>
            <Col xs={12} md={6}>
              <div className='text-gray-80 mb-[10px] mt-[24px] text-xs sm:mt-[0px]'>
                EndTime
              </div>
              <div>
                {dayjs(currentBillingDetail?.endTime).format(
                  'YYYY/MM/DD HH:mm:ss'
                )}
              </div>
            </Col>
          </Row>
          <Row gutter={24} className='mt-[24px]'>
            <Col xs={12} md={6}>
              <div className='text-gray-80 mb-[10px] text-xs'>Status</div>
              <div>
                {currentBillingDetail?.status === 0 && (
                  <Tag color='volcano'>Unpaid</Tag>
                )}
                {currentBillingDetail?.status === 1 && (
                  <Tag color='processing'>PaymentPending</Tag>
                )}
                {currentBillingDetail?.status === 2 && (
                  <Tag color='success'>PaymentConfirmed</Tag>
                )}
                {currentBillingDetail?.status === 3 && (
                  <Tag color='red'>PaymentFailed</Tag>
                )}
              </div>
            </Col>
            <Col xs={12} md={6}>
              <div className='text-gray-80 mb-[10px] text-xs'>Type</div>
              <div>
                <Tag color='processing'>
                  {BillingType[currentBillingDetail?.type]}
                </Tag>
              </div>
            </Col>
            <Col xs={12} md={6}>
              <div className='text-gray-80 mb-[10px] mt-[24px] text-xs sm:mt-[0px]'>
                CreateTime
              </div>
              <div>
                {dayjs(currentBillingDetail?.createTime).format(
                  'YYYY/MM/DD HH:mm:ss'
                )}
              </div>
            </Col>
            <Col xs={12} md={6}>
              <div className='text-gray-80 mb-[10px] mt-[24px] text-xs sm:mt-[0px]'>
                PaymentTime
              </div>
              <div>
                {dayjs(currentBillingDetail?.paymentTime).format(
                  'YYYY/MM/DD HH:mm:ss'
                )}
              </div>
            </Col>
          </Row>
        </div>
        {currentBillingDetail?.details?.length > 0 &&
          currentBillingDetail?.details?.map((item, index) => {
            return (
              <div
                key={index}
                className='border-gray-F5 my-[24px] rounded-lg border p-[24px]'
              >
                {item?.asset?.id && (
                  <div>
                    <div className='text-dark-normal mb-[12px] text-xl'>
                      Asset - {index + 1}
                    </div>
                    <div className='bg-gray-F5 w-full rounded-lg p-[24px]'>
                      <Row gutter={24}>
                        <Col xs={12} md={6}>
                          <Copy
                            label='Billing Id'
                            content={item?.asset?.id}
                            isShowCopy={true}
                            showLittle={true}
                          />
                        </Col>
                        <Col xs={12} md={6}>
                          <div className='text-gray-80 mb-[10px] text-xs'>
                            PaidAmount
                          </div>
                          {String(item?.asset?.paidAmount)} USDT
                        </Col>
                        <Col xs={12} md={6}>
                          <div className='text-gray-80 mb-[10px] mt-[24px] text-xs sm:mt-[0px]'>
                            FreeQuantity
                          </div>
                          {item?.asset?.freeQuantity || '--'}
                        </Col>
                        <Col xs={12} md={6}>
                          <div className='text-gray-80 mb-[10px] mt-[24px] text-xs sm:mt-[0px]'>
                            Quantity
                          </div>
                          {item?.asset?.quantity || '--'}
                        </Col>
                      </Row>
                      <Row gutter={24} className='mt-[24px]'>
                        <Col xs={12} md={6}>
                          <div className='text-gray-80 mb-[10px] text-xs'>
                            FreeReplicas
                          </div>
                          {item?.asset?.freeReplicas || '--'}
                        </Col>
                        <Col xs={12} md={6}>
                          <div className='text-gray-80 mb-[10px] text-xs'>
                            Replicas
                          </div>
                          {item?.asset?.replicas || '--'}
                        </Col>
                        <Col xs={12} md={6}>
                          <div className='text-gray-80 mb-[10px] mt-[24px] text-xs sm:mt-[0px]'>
                            AeIndexer
                          </div>
                          {item?.asset?.appId || '--'}
                        </Col>
                        <Col xs={12} md={6}>
                          <div className='text-gray-80 mb-[10px] mt-[24px] text-xs sm:mt-[0px]'>
                            isLocked
                          </div>
                          {String(item?.asset?.isLocked)}
                        </Col>
                      </Row>
                      <Row gutter={24} className='mt-[24px]'>
                        <Col xs={12} md={6}>
                          <div className='text-gray-80 mb-[10px] text-xs'>
                            Status
                          </div>
                          <div>
                            {item?.asset?.status === 0 && (
                              <Tag color='volcano'>Unpaid</Tag>
                            )}
                            {item?.asset?.status === 1 && (
                              <Tag color='processing'>PaymentPending</Tag>
                            )}
                            {item?.asset?.status === 2 && (
                              <Tag color='success'>PaymentConfirmed</Tag>
                            )}
                            {item?.asset?.status === 3 && (
                              <Tag color='orange'>Canceled</Tag>
                            )}
                            {item?.asset?.status === 4 && (
                              <Tag color='red'>PaymentFailed</Tag>
                            )}
                          </div>
                        </Col>
                        <Col xs={12} md={6}>
                          <div className='text-gray-80 mb-[10px] text-xs'>
                            createTime
                          </div>
                          {dayjs(item?.asset?.createTime).format(
                            'YYYY/MM/DD HH:mm:ss'
                          )}
                        </Col>
                        <Col xs={12} md={6}>
                          <div className='text-gray-80 mb-[10px] mt-[24px] text-xs sm:mt-[0px]'>
                            StartTime
                          </div>
                          {dayjs(item?.asset?.startTime).format(
                            'YYYY/MM/DD HH:mm:ss'
                          )}
                        </Col>
                        <Col xs={12} md={6}>
                          <div className='text-gray-80 mb-[10px] mt-[24px] text-xs sm:mt-[0px]'>
                            EndTime
                          </div>
                          {dayjs(item?.asset?.endTime).format(
                            'YYYY/MM/DD HH:mm:ss'
                          )}
                        </Col>
                      </Row>
                    </div>
                  </div>
                )}
                <div>
                  <div className='text-dark-normal mb-[12px] mt-[24px] text-xl'>
                    Billing - {index + 1}
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
                          specification
                        </div>
                        {item?.merchandise?.specification || '--'}
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
                          RefundAmount
                        </div>
                        {String(item?.refundAmount)} USDT
                      </Col>
                      <Col xs={12} md={6}>
                        <div className='text-gray-80 mb-[10px] text-xs'>
                          PaidAmount
                        </div>
                        {String(item?.paidAmount)} USDT
                      </Col>
                      <Col xs={12} md={6}>
                        <div className='text-gray-80 mb-[10px] text-xs'>
                          Price
                        </div>
                        {item?.merchandise?.price || '--'} USDT
                      </Col>
                      <Col xs={12} md={6}>
                        <div className='text-gray-80 mb-[10px] mt-[24px] text-xs sm:mt-[0px]'>
                          Unit
                        </div>
                        {String(item?.merchandise?.unit)}
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
