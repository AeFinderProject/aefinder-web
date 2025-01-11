'use client';

import { LeftOutlined } from '@ant-design/icons';
import { Col, Row, Tag } from 'antd';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';

import { useDebounceCallback } from '@/lib/utils';

import { queryAuthToken } from '@/api/apiUtils';
import { getBillingsDetail } from '@/api/requestMarket';

import { BillingEnum } from '@/types/marketType';

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
          Billing overview
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
              <div className='text-gray-80 mb-[10px] text-xs'>Type</div>
              <div>
                {currentBillingDetail?.type === 0 && (
                  <Tag color='success'>
                    {BillingEnum[currentBillingDetail?.type]}
                  </Tag>
                )}
                {currentBillingDetail?.type === 1 && (
                  <Tag color='processing'>
                    {BillingEnum[currentBillingDetail?.type]}
                  </Tag>
                )}
              </div>
            </Col>
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
                className='border-gray-F5 hover:bg-gray-F7 my-[24px] rounded-lg border p-[12px]'
              >
                <div>
                  <div className='text-dark-normal mb-[12px] text-xl'>
                    Billing Item - {index + 1}
                  </div>
                  <div className='bg-gray-F5 w-full  rounded-lg p-[24px]'>
                    <Row gutter={24}>
                      <Col xs={12} md={6} className='my-[12px]'>
                        <div className='text-gray-80 mb-[10px] text-xs'>
                          Merchandise Name
                        </div>
                        {item?.merchandise?.name || '--'}
                      </Col>
                      <Col xs={12} md={6} className='my-[12px]'>
                        <div className='text-gray-80 mb-[10px] text-xs'>
                          Specification
                        </div>
                        {item?.merchandise?.specification || '--'}
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
                      <Col xs={12} md={6} className='my-[12px]'>
                        <div className='text-gray-80 mb-[10px] text-xs'>
                          RefundAmount
                        </div>
                        {String(item?.refundAmount)} USDT
                      </Col>
                      <Col xs={12} md={6} className='my-[12px]'>
                        <div className='text-gray-80 mb-[10px] text-xs'>
                          PaidAmount
                        </div>
                        {String(item?.paidAmount)} USDT
                      </Col>
                      <Col xs={12} md={6} className='my-[12px]'>
                        <div className='text-gray-80 mb-[10px] text-xs'>
                          Price
                        </div>
                        {item?.merchandise?.price || '--'} USDT/
                        {String(item?.merchandise?.unit)}
                      </Col>
                      {item?.asset?.appId && (
                        <Col xs={12} md={6} className='my-[12px]'>
                          <div className='text-gray-80 mb-[10px] text-xs'>
                            AeIndexer
                          </div>
                          {item?.asset?.appId}
                        </Col>
                      )}
                      {item?.asset?.createTime && (
                        <Col xs={12} md={6} className='my-[12px]'>
                          <div className='text-gray-80 mb-[10px] text-xs'>
                            createTime
                          </div>
                          {dayjs(item?.asset?.createTime).format(
                            'YYYY/MM/DD HH:mm:ss'
                          )}
                        </Col>
                      )}
                      {item?.asset?.startTime && (
                        <Col xs={12} md={6} className='my-[12px]'>
                          <div className='text-gray-80 mb-[10px] text-xs'>
                            StartTime
                          </div>
                          {dayjs(item?.asset?.startTime).format(
                            'YYYY/MM/DD HH:mm:ss'
                          )}
                        </Col>
                      )}
                      {item?.asset?.endTime && (
                        <Col xs={12} md={6} className='my-[12px]'>
                          <div className='text-gray-80 mb-[10px] text-xs'>
                            EndTime
                          </div>
                          {dayjs(item?.asset?.endTime).format(
                            'YYYY/MM/DD HH:mm:ss'
                          )}
                        </Col>
                      )}
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
