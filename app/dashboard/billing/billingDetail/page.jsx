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
        <div className='bg-gray-F5 w-full rounded-lg px-[24px] py-[12px]'>
          <Row gutter={24}>
            <Col xs={12} md={6} className='my-[12px]'>
              <div className='text-gray-80 mb-[10px] text-xs'>
                Refund Amount
              </div>
              {String(currentBillingDetail?.refundAmount)} USDT
            </Col>
            <Col xs={12} md={6} className='my-[12px]'>
              <div className='text-gray-80 mb-[10px] text-xs'>Paid Amount</div>
              {String(currentBillingDetail?.paidAmount)} USDT
            </Col>
            <Col xs={12} md={6} className='my-[12px]'>
              <div className='text-gray-80 mb-[10px] text-xs'>Begin Time</div>
              <div>
                {dayjs(currentBillingDetail?.beginTime).format(
                  'YYYY/MM/DD HH:mm:ss'
                )}
              </div>
            </Col>
            <Col xs={12} md={6} className='my-[12px]'>
              <div className='text-gray-80 mb-[10px] text-xs'>End Time</div>
              <div>
                {dayjs(currentBillingDetail?.endTime).format(
                  'YYYY/MM/DD HH:mm:ss'
                )}
              </div>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col xs={12} md={6} className='my-[12px]'>
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
            <Col xs={12} md={6} className='my-[12px]'>
              <div className='text-gray-80 mb-[10px] text-xs'>Status</div>
              <div>
                {currentBillingDetail?.status === 0 && (
                  <Tag color='volcano'>Unpaid</Tag>
                )}
                {currentBillingDetail?.status === 1 && (
                  <Tag color='processing'>Payment Pending</Tag>
                )}
                {currentBillingDetail?.status === 2 && (
                  <Tag color='success'>Payment Confirmed</Tag>
                )}
                {currentBillingDetail?.status === 3 && (
                  <Tag color='red'>Payment Failed</Tag>
                )}
              </div>
            </Col>
            <Col xs={12} md={6} className='my-[12px]'>
              <div className='text-gray-80 mb-[10px] text-xs'>Create Time</div>
              <div>
                {dayjs(currentBillingDetail?.createTime).format(
                  'YYYY/MM/DD HH:mm:ss'
                )}
              </div>
            </Col>
            <Col xs={12} md={6} className='my-[12px]'>
              <div className='text-gray-80 mb-[10px] text-xs'>Payment Time</div>
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
                          Price
                        </div>
                        {item?.merchandise?.price || '--'} USDT/
                        {String(item?.merchandise?.unit)}
                      </Col>
                      {item?.merchandise?.type === 0 && (
                        <Col xs={12} md={6} className='my-[12px]'>
                          <div className='text-gray-80 mb-[10px] text-xs'>
                            Quantity
                          </div>
                          {item?.quantity || '--'}
                        </Col>
                      )}
                      {item?.merchandise?.type === 1 && (
                        <Col xs={12} md={6} className='my-[12px]'>
                          <div className='text-gray-80 mb-[10px] text-xs'>
                            Specification
                          </div>
                          {item?.merchandise?.specification || '--'}
                        </Col>
                      )}
                      {item?.merchandise?.type === 2 && (
                        <Col xs={12} md={6} className='my-[12px]'>
                          <div className='text-gray-80 mb-[10px] text-xs'>
                            Replicas
                          </div>
                          {item?.replicas || '--'}{' '}
                          {String(item?.merchandise?.unit)}
                        </Col>
                      )}
                      {item?.asset?.appId && (
                        <Col xs={12} md={6} className='my-[12px]'>
                          <div className='text-gray-80 mb-[10px] text-xs'>
                            AeIndexer
                          </div>
                          {item?.asset?.appId}
                        </Col>
                      )}
                      {item?.asset?.startTime && (
                        <Col xs={12} md={6} className='my-[12px]'>
                          <div className='text-gray-80 mb-[10px] text-xs'>
                            Start Time
                          </div>
                          {dayjs(item?.asset?.startTime).format(
                            'YYYY/MM/DD HH:mm:ss'
                          )}
                        </Col>
                      )}
                      {item?.asset?.endTime && (
                        <Col xs={12} md={6} className='my-[12px]'>
                          <div className='text-gray-80 mb-[10px] text-xs'>
                            End Time
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
