import { Line } from '@ant-design/charts';
import { CopyOutlined } from '@ant-design/icons';
import type { TabsProps } from 'antd';
import {
  Button,
  Col,
  Divider,
  message,
  Row,
  Select,
  Tabs,
  Tooltip,
} from 'antd';
import dayjs from 'dayjs';
import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { useDebounceCallback } from '@/lib/utils';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setDefaultAeIndexersList,
  setDefaultAPIList,
} from '@/store/slices/appSlice';

import { queryAuthToken } from '@/api/apiUtils';
import {
  getAeIndexersList,
  getAeIndexerSnapshots,
  getApiKeySnapshot,
  getAPIList,
  getAPISnapshots,
} from '@/api/requestAPIKeys';

import {
  AeIndexersItem,
  ApiItem,
  ApiType,
  SnapshotsItemType,
} from '@/types/apikeyType';

const Option = Select.Option;

export default function ApikeyOverview() {
  const dispatch = useAppDispatch();
  const [messageApi, contextHolder] = message.useMessage();

  const [currentAppId, setCurrentAppId] = useState('');
  const [currentApiType, setCurrentApiType] = useState<string>('');
  const [currentTime, setCurrentTime] = useState('2');

  const [selectAppIdItem, setSelectAppIdItem] = useState<AeIndexersItem>();
  const [selectApiTypeItem, setSelectApiTypeItem] = useState<ApiItem>();
  const [snapshotsData, setSnapshotsData] = useState<SnapshotsItemType[]>([]);

  const apikeyDetail = useAppSelector((state) => state.app.apikeyDetail);
  const defaultAeindexersList = useAppSelector(
    (state) => state.app.defaultAeindexersList
  );
  const defaultAPIList = useAppSelector((state) => state.app.defaultAPIList);

  const tabsItems: TabsProps['items'] = [
    {
      key: '0',
      label: '1W',
    },
    {
      key: '1',
      label: '1M',
    },
    {
      key: '2',
      label: 'ALL TIME',
    },
  ];

  // const data = [
  //   { time: '1991', query: 3 },
  //   { time: '1992', query: 4 },
  //   { time: '1993', query: 3.5 },
  //   { time: '1994', query: 5 },
  //   { time: '1995', query: 4.9 },
  //   { time: '1996', query: 6 },
  // ];
  const config = {
    data: snapshotsData,
    xField: 'time',
    yField: 'query',
  };

  const getAeindexersListTemp = useCallback(async () => {
    if (!apikeyDetail?.id) return;
    await queryAuthToken();
    const params = {
      id: apikeyDetail?.id,
      appId: currentAppId,
      skipCount: 0,
      maxResultCount: 1000,
    };
    const { items } = await getAeIndexersList(params);
    console.log('items', items);
    if (currentAppId === '') {
      dispatch(setDefaultAeIndexersList(items));
    } else {
      setSelectAppIdItem(items[0]);
    }
  }, [dispatch, apikeyDetail?.id, currentAppId]);

  const getAPIListTemp = useCallback(async () => {
    if (!apikeyDetail?.id) return;
    const params = {
      id: apikeyDetail?.id,
      api: currentApiType,
      skipCount: 0,
      maxResultCount: 1000,
    };
    const { items } = await getAPIList(params);
    console.log('items', items);
    if (currentApiType === '') {
      dispatch(setDefaultAPIList(items));
    } else {
      setSelectApiTypeItem(items[0]);
    }
  }, [dispatch, apikeyDetail?.id, currentApiType]);

  useEffect(() => {
    getAeindexersListTemp();
    getAPIListTemp();
  }, [
    apikeyDetail?.id,
    currentAppId,
    currentApiType,
    getAeindexersListTemp,
    getAPIListTemp,
  ]);

  const getSnapshotsData = useDebounceCallback(async () => {
    if (!apikeyDetail?.id) return;

    const currentDate = dayjs();
    const currentDateISO = currentDate.toISOString();
    const oneWeekAgoISO = currentDate.subtract(7, 'day').toISOString();
    const oneMonthAgoISO = currentDate.subtract(1, 'month').toISOString();
    let time = '';
    if (currentTime === '0') {
      time = oneWeekAgoISO;
    } else if (currentTime === '1') {
      time = oneMonthAgoISO;
    }
    let itemsTemp: SnapshotsItemType[] = [];
    const params = {
      id: apikeyDetail?.id,
      beginTime: time,
      endTime: currentDateISO,
      type: currentTime === '2' ? '' : Number(currentTime),
    };
    if (currentAppId === '' && currentApiType === '') {
      const { items } = await getApiKeySnapshot(params);
      itemsTemp = items;
    }
    if (currentAppId !== '') {
      const { items } = await getAeIndexerSnapshots({
        ...params,
        appId: currentAppId,
      });
      itemsTemp = items;
    }
    if (currentApiType !== '') {
      const { items } = await getAPISnapshots({
        ...params,
        api: Number(currentApiType),
      });
      itemsTemp = items;
    }
    console.log('itemsTemp', itemsTemp);
    setSnapshotsData(itemsTemp);
  }, [apikeyDetail?.id, currentAppId, currentApiType, currentTime]);

  useEffect(() => {
    getSnapshotsData();
  }, [
    getSnapshotsData,
    apikeyDetail?.id,
    currentAppId,
    currentApiType,
    currentTime,
  ]);

  const handleAppIdChange = (value: string) => {
    setCurrentAppId(value);
    setCurrentApiType('');
  };

  const handleApiTypeChange = (value: string) => {
    setCurrentAppId('');
    setCurrentApiType(value);
  };

  const onTabsChange = (key: string) => {
    setCurrentTime(key);
  };

  const handleCopy = () => {
    messageApi.success({
      content: 'Copied',
      key: 'copy',
    });
  };

  return (
    <div>
      {contextHolder}
      {!apikeyDetail?.totalQuery && (
        <div className='flex flex-col items-center justify-center'>
          <Image
            src='/assets/svg/billing-empty.svg'
            alt='info'
            width={409}
            height={192}
            className='mb-[8px] mt-[80px]'
          />
          <div className='text-dark-normal text-2xl font-medium'>
            No Queries Yet
          </div>
          <div className='text-gray-80 my-[22px] text-center'>
            Your API has not been used yet. Your API key can be used to query
            Subgraphs.
            <div className='text-blue-link mt-[4px] cursor-pointer'>
              Learn more
            </div>
          </div>
          <div className='border-gray-E0 flex h-[70px] w-[356px] items-center justify-between rounded-md border p-[12px]'>
            <div>
              <div className='text-gray-80 text-sm'>API</div>
              <div className='text-dark-normal max-w-[150px] truncate'>
                {apikeyDetail.key}
              </div>
            </div>
            <Button type='primary'>
              <CopyToClipboard
                text={apikeyDetail.key}
                onCopy={() => handleCopy()}
                style={{ color: '#FFF' }}
              >
                <div>
                  <CopyOutlined className='relative top-[-2px] mx-[6px] inline-block cursor-pointer align-middle text-white' />
                  <span>Copy</span>
                </div>
              </CopyToClipboard>
            </Button>
          </div>
        </div>
      )}
      {apikeyDetail?.totalQuery > 0 && (
        <div>
          <div className='flex items-center justify-between'>
            <div>
              <Select
                className='mr-[8px] w-[176px]'
                value={currentAppId}
                onChange={handleAppIdChange}
              >
                <Option key='' value=''>
                  All AeIndexers
                </Option>
                {defaultAeindexersList?.map((item) => {
                  return (
                    <Option key={item.appId} value={item.appId}>
                      {item.appName}
                    </Option>
                  );
                })}
              </Select>
              <Select
                className='w-[176px]'
                value={currentApiType}
                onChange={handleApiTypeChange}
              >
                <Option key='' value=''>
                  All Queries
                </Option>
                {defaultAPIList?.map((item) => {
                  return (
                    <Option key={item.api} value={item.api}>
                      {ApiType[item.api]}
                    </Option>
                  );
                })}
              </Select>
            </div>
            <Tabs
              defaultActiveKey={currentTime}
              items={tabsItems}
              onChange={onTabsChange}
            />
          </div>
          <div className='border-gray-E0 bg-gray-F5 mb-[48px] flex items-center justify-between rounded-lg border p-[24px]'>
            <div>
              <div className='mb-[4px]'>
                <span className='text-gray-80 mr-[8px] text-sm'>
                  Total Queries
                </span>
                <Tooltip
                  title='The total volume of queries made by your API keys'
                  className='inline-block align-middle'
                >
                  <Image
                    src='/assets/svg/info-filled.svg'
                    alt='info'
                    width={16}
                    height={16}
                    className='relative'
                  />
                </Tooltip>
              </div>
              <div className='text-dark-normal font-medium'>
                {currentAppId === '' &&
                  currentApiType === '' &&
                  apikeyDetail?.totalQuery}
                {currentAppId !== '' && selectAppIdItem?.totalQuery}
                {currentApiType !== '' && selectApiTypeItem?.totalQuery}
              </div>
            </div>
            <div>
              <div className='mb-[4px]'>
                <span className='text-gray-80 mr-[8px] text-sm'>
                  Total Query fees
                </span>
                <Tooltip
                  title='The total fees paid by your API keys.'
                  className='inline-block align-middle'
                >
                  <Image
                    src='/assets/svg/info-filled.svg'
                    alt='info'
                    width={16}
                    height={16}
                    className='relative'
                  />
                </Tooltip>
              </div>
              <div className='text-dark-normal font-medium'>
                $230.00
                <span className='text-gray-80 ml-[4px] font-medium'>USDT</span>
              </div>
            </div>
            <div>
              <div className='mb-[4px]'>
                <span className='text-gray-80 mr-[8px] text-sm'>
                  Average Query Cost
                </span>
                <Tooltip
                  title='Average Query Cost'
                  className='inline-block align-middle'
                >
                  <Image
                    src='/assets/svg/info-filled.svg'
                    alt='info'
                    width={16}
                    height={16}
                    className='relative'
                  />
                </Tooltip>
              </div>
              <div className='text-dark-normal font-medium'>
                0.000191
                <span className='text-gray-80 ml-[4px] mr-[12px] font-medium'>
                  USDT
                </span>
              </div>
            </div>
            <div></div>
          </div>
          {snapshotsData.length > 0 && (
            <div>
              <div className='text-dark-normal mt-[32px]'>Query count</div>
              <Line {...config} />
            </div>
          )}
          <div className='mt-[40px]'>
            <div className='text-dark-normal mb-[8px] text-2xl font-medium'>
              Authorised AeIndexers
            </div>
            <div className='text-gray-80'>
              Only the AeIndexers in this list will be able to use this API key.
              If no AeIndexers are added then all AeIndexers can be queried with
              this key.
            </div>
            <div className='border-gray-E0 mt-[24px] rounded-lg border px-[28px] pb-[12px] pt-[32px]'>
              <Row gutter={24}>
                <Col span={9} className='text-gray-80 text-sm'>
                  AeIndexer
                </Col>
                <Col span={5} className='text-gray-80 text-sm'>
                  Total queries
                </Col>
                <Col span={5} className='text-gray-80 text-sm'>
                  Total query fees
                </Col>
                <Col span={5} className='text-gray-80 text-sm'>
                  Last query
                </Col>
              </Row>
              <Divider className='my-[12px]' />
              {defaultAeindexersList?.map((item) => {
                return (
                  <Row
                    gutter={24}
                    key={item.appId}
                    className='py-[20px] hover:bg-gray-50'
                  >
                    <Col span={9} className='flex items-center justify-start'>
                      <div className='bg-gray-D6 mr-[14px] h-[22px] w-[22px] rounded-3xl'></div>
                      <div>
                        <div className='text-dark-normal mb-[4px] text-sm'>
                          {item.appName}
                        </div>
                        <div className='text-gray-80 text-xs'>{item.appId}</div>
                      </div>
                    </Col>
                    <Col span={5} className='text-gray-80'>
                      {item.totalQuery}
                    </Col>
                    <Col span={5} className='text-gray-80'>
                      0.000574
                    </Col>
                    <Col span={5} className='text-gray-80'>
                      {dayjs(item.lastQueryTime).format('YYYY/MM/DD HH:mm:ss')}
                    </Col>
                  </Row>
                );
              })}
            </div>
          </div>
          <div className='mt-[40px]'>
            <div className='text-dark-normal mb-[8px] text-2xl font-medium'>
              Authorised AeFinder APIs
            </div>
            <div className='text-gray-80'>
              Only the APIs in this list will be able to use this API key.{' '}
            </div>
            <div className='border-gray-E0 mt-[24px] rounded-lg border px-[28px] pb-[12px] pt-[32px]'>
              <Row gutter={24}>
                <Col span={9} className='text-gray-80 text-sm'>
                  API
                </Col>
                <Col span={5} className='text-gray-80 text-sm'>
                  Total queries
                </Col>
                <Col span={5} className='text-gray-80 text-sm'>
                  Total query fees
                </Col>
                <Col span={5} className='text-gray-80 text-sm'>
                  Last query
                </Col>
              </Row>
              <Divider className='my-[12px]' />
              {defaultAPIList?.map((item) => {
                return (
                  <Row
                    gutter={24}
                    key={item.api}
                    className='py-[20px] hover:bg-gray-50'
                  >
                    <Col span={9} className='flex items-center justify-start'>
                      {ApiType[item.api]}
                    </Col>
                    <Col span={5} className='text-gray-80'>
                      {item.totalQuery}
                    </Col>
                    <Col span={5} className='text-gray-80'>
                      0.000574
                    </Col>
                    <Col span={5} className='text-gray-80'>
                      {dayjs(item.lastQueryTime).format('YYYY/MM/DD HH:mm:ss')}
                    </Col>
                  </Row>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
