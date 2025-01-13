import type { TableColumnsType } from 'antd';
import { Button, message, Popconfirm, Table, Tag } from 'antd';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';

import { useDebounceCallback } from '@/lib/utils';

import Copy from '@/components/Copy';

import { cancelOrder, getOrdersList } from '@/api/requestMarket';

import { NewOrderItemType } from '@/types/marketType';

export default function OrderList() {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();

  const [orderList, setOrderList] = useState<NewOrderItemType[]>([]);
  const [skipCount, setSkipCount] = useState(1);
  const [maxResultCount, setMaxResultCount] = useState(10);
  const [totalCountItems, setTotalCountItems] = useState(0);

  const tableOnChange = useCallback(
    (page: number, pageSize: number) => {
      if (page !== skipCount) {
        setSkipCount(page);
      }
      if (maxResultCount !== pageSize) {
        // pageSize change and skipCount need init 1
        setSkipCount(1);
        setMaxResultCount(pageSize);
      }
    },
    [skipCount, maxResultCount]
  );

  const getOrdersListTemp = useDebounceCallback(async () => {
    const { items, totalCount } = await getOrdersList({
      sortType: 1,
      skipCount: (skipCount - 1) * maxResultCount,
      maxResultCount: maxResultCount,
    });
    setOrderList(items);
    setTotalCountItems(totalCount);
  }, [skipCount, maxResultCount]);

  useEffect(() => {
    getOrdersListTemp();
  }, [getOrdersListTemp]);

  const handleCancelOrder = useDebounceCallback(async (orderId: string) => {
    const cancelRes = await cancelOrder({
      id: orderId,
    });
    if (cancelRes) {
      messageApi.success('Cancel order successfully');
      getOrdersListTemp();
    }
  }, []);

  const columns: TableColumnsType = [
    {
      title: 'Order Id',
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => (
        <div>
          <Copy label='' content={text} isShowCopy={true} showLittle={true} />
        </div>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (text: number) => (
        <div>
          {text}
          <span className='ml-[4px] text-sm'>USDT</span>
        </div>
      ),
    },
    {
      title: 'DeductionAmount',
      dataIndex: 'deductionAmount',
      key: 'deductionAmount',
      render: (text: number) => (
        <div>
          {text}
          <span className='ml-[4px] text-sm'>USDT</span>
        </div>
      ),
    },
    {
      title: 'ActualAmount',
      dataIndex: 'actualAmount',
      key: 'actualAmount',
      render: (text: number) => (
        <div>
          {text}
          <span className='ml-[4px] text-sm'>USDT</span>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text: number) => (
        <div>
          {text === 0 && <Tag color='volcano'>Unpaid</Tag>}
          {text === 1 && <Tag color='processing'>PaymentPending</Tag>}
          {text === 2 && <Tag color='success'>PaymentConfirmed</Tag>}
          {text === 3 && <Tag color='orange'>Canceled</Tag>}
          {text === 4 && <Tag color='red'>PaymentFailed</Tag>}
        </div>
      ),
    },
    {
      title: 'PaymentType',
      dataIndex: 'paymentType',
      key: 'paymentType',
      render: (text: number) => (
        <div>
          {text === 0 && <Tag color='warning'>--</Tag>}
          {text === 1 && <Tag color='success'>WalletPay</Tag>}
        </div>
      ),
    },
    {
      title: 'OrderTime',
      dataIndex: 'orderTime',
      key: 'orderTime',
      render: (text: string) => (
        <div>{dayjs(text).format('YYYY/MM/DD HH:mm:ss')}</div>
      ),
    },
    {
      title: 'PaymentTime',
      dataIndex: 'paymentTime',
      key: 'paymentTime',
      render: (text: string) => (
        <div>{dayjs(text).format('YYYY/MM/DD HH:mm:ss')}</div>
      ),
    },
    {
      title: 'TransactionId',
      dataIndex: 'transactionId',
      key: 'transactionId',
      render: (text: string) => (
        <div>
          {text ? (
            <Copy label='' content={text} isShowCopy={true} showLittle={true} />
          ) : (
            '--'
          )}
        </div>
      ),
    },
    {
      title: 'CancelOrder',
      dataIndex: '',
      key: 'cancelOrder',
      render: (record) => (
        console.log(record),
        (
          <div>
            {(record?.status === 0 || record?.status === 4) && (
              <Popconfirm
                placement='top'
                title='Are you sure to delete this order?'
                okText='Yes'
                cancelText='No'
                onConfirm={() => handleCancelOrder(record?.id)}
              >
                <Button>Cancel</Button>
              </Popconfirm>
            )}
            {record?.status !== 1 && record?.status !== 4 && (
              <Button disabled>Cancel</Button>
            )}
          </div>
        )
      ),
    },
    {
      title: 'View Details',
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => (
        console.log(text),
        (
          <div
            className='text-blue-link cursor-pointer'
            onClick={() =>
              router.push(`/dashboard/billing/orderDetail?orderId=${text}`)
            }
          >
            Details
          </div>
        )
      ),
    },
  ];

  return (
    <div>
      {contextHolder}
      {orderList.length === 0 && (
        <div className='flex flex-col items-center justify-center'>
          <Image
            src='/assets/svg/invoices.svg'
            alt='invoices'
            width={227}
            height={128}
            className='mt-[170px]'
          />
          <div className='text-dark-normal mb-[14px] mt-[45px] text-2xl font-medium'>
            No orders yet
          </div>
          <div className='text-gray-80'>
            Your orders will appear here once you've made a purchase.
          </div>
        </div>
      )}
      {orderList.length > 0 && (
        <div className='mt-[4px]'>
          <Table
            rowKey='id'
            columns={columns}
            dataSource={orderList}
            className='w-full'
            scroll={{ x: 'max-content' }}
            pagination={{
              current: skipCount,
              pageSize: maxResultCount,
              total: totalCountItems,
              onChange: tableOnChange,
              showSizeChanger: true,
              showTitle: true,
              showTotal: (total) => `Total ${total} orders`,
              pageSizeOptions: ['10', '20', '50'],
            }}
          />
        </div>
      )}
    </div>
  );
}
