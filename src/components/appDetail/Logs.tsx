import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  SearchOutlined,
  SyncOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { Button, Input, Select, Tag } from 'antd';
import { MessageInstance } from 'antd/es/message/interface';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';

import { useThrottleCallback } from '@/lib/utils';

import { useAppSelector } from '@/store/hooks';

import { getLog } from '@/api/requestApp';
import { LogsColor, LogsText } from '@/constant';

import LogsItem from './LogsItem';

import { ChainIdType, GetLogResponse, LevelType } from '@/types/appType';

const Option = Select.Option;

type LogsProps = {
  readonly messageApi: MessageInstance;
};

export default function Logs({ messageApi }: LogsProps) {
  const [search, setSearch] = useState<string>('');
  const [filterBy, setFilterBy] = useState<Array<LevelType>>([]);
  const [sortBy, setSortBy] = useState<string>('Newest');
  const [logsList, setLogsList] = useState<GetLogResponse[]>([]);
  const [startTime, setStartTime] = useState<string>('');
  const [logId, setLogId] = useState<string>('');
  const [chainId, setChainId] = useState<ChainIdType>('');
  const [chainIdList, setChainIdList] = useState<Array<ChainIdType>>([]);
  const { currentAppDetail, currentVersion, subscriptions } = useAppSelector(
    (state) => state.app
  );

  useEffect(() => {
    const tempList = [] as Array<ChainIdType>;
    if (subscriptions?.currentVersion?.version === currentVersion) {
      const subscriptionItems =
        subscriptions?.currentVersion?.subscriptionManifest
          ?.subscriptionItems ||
        subscriptions?.currentVersion?.subscriptionManifest?.SubscriptionItems;
      subscriptionItems?.forEach((item) => {
        tempList.push(item.chainId);
      });
    } else if (subscriptions?.pendingVersion?.version === currentVersion) {
      const subscriptionItems =
        subscriptions?.pendingVersion?.subscriptionManifest
          ?.subscriptionItems ||
        subscriptions?.pendingVersion?.subscriptionManifest?.SubscriptionItems;
      subscriptionItems?.forEach((item) => {
        tempList.push(item.chainId);
      });
    }
    setChainIdList(tempList);
  }, [currentVersion, subscriptions]);

  const handleSearch = useThrottleCallback((value) => {
    setLogsList([]);
    setStartTime('');
    setLogId('');
    setSearch(value);
  }, []);

  const handleChangeChainId = useCallback((value: ChainIdType) => {
    setLogsList([]);
    setStartTime('');
    setLogId('');
    setChainId(value);
  }, []);

  const updateFilterBy = useCallback(
    (newValue: LevelType) => {
      const index = filterBy.indexOf(newValue);
      const tempFilterBy = [...filterBy];
      if (index !== -1) {
        tempFilterBy.splice(index, 1);
      } else {
        tempFilterBy.push(newValue);
      }
      setFilterBy(tempFilterBy);
    },
    [filterBy]
  );

  const handleFilterBy = useThrottleCallback(
    (value) => {
      setLogsList([]);
      setStartTime('');
      setLogId('');
      updateFilterBy(value);
    },
    [filterBy]
  );

  useEffect(() => {
    // init params when currentVersion change
    setSearch('');
    setFilterBy([]);
    setLogsList([]);
    setStartTime('');
    setLogId('');
  }, [currentVersion]);

  const getLogs = useCallback(async () => {
    // when currentVersion is null, it means the app is not deployed
    if (!currentVersion) return;
    const res = await getLog({
      appId: currentAppDetail.appId,
      version: currentVersion,
      startTime: startTime,
      logId: logId,
      searchKeyWord: search,
      chainId: chainId,
      levels: filterBy,
    });
    if (!res?.length) {
      return;
    }
    // get last log timestamp as the next request's startTime and logId
    setStartTime(res[0].timestamp);
    setLogId(res[0].log_id);
    // add new logs to the end
    let tempList = [...res, ...logsList];
    if (tempList.length > 1500) {
      tempList = [...tempList.slice(0, 1500)];
    }
    setLogsList(tempList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentAppDetail.appId,
    currentVersion,
    startTime,
    logId,
    search,
    filterBy,
    chainId,
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      getLogs();
    }, 5000);

    return () => clearInterval(interval);
  });

  return (
    <div>
      <div className='mb-[16px] flex flex-col md:flex-row md:items-center md:justify-between'>
        <div className='mb-3 whitespace-nowrap md:mb-0'>
          <Input
            placeholder='Search logs'
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            style={{
              width: 200,
              height: 32,
              borderColor: '#E0E0E0',
              borderRadius: '8px',
              marginRight: '8px',
            }}
            prefix={<SearchOutlined className='text-[#E0E0E0]' />}
          />
          <Select
            value={chainId}
            onChange={(value) => handleChangeChainId(value)}
            style={{
              width: 160,
              height: 32,
              borderColor: '#E0E0E0',
              borderRadius: '8px',
              marginRight: '8px',
            }}
          >
            <Option value=''>All Chain</Option>
            {chainIdList.length > 0 &&
              chainIdList.map((item) => (
                <Option key={item} value={item}>
                  {item}
                </Option>
              ))}
          </Select>
        </div>
        <Button.Group className='ml-1 mt-3 min-w-[370px] sm:ml-0 sm:mt-0'>
          <Button
            value='Error'
            type={filterBy.indexOf('Error') > -1 ? 'primary' : 'default'}
            onClick={() => handleFilterBy('Error')}
          >
            <ExclamationCircleOutlined className='relative top-[-3px]' />
            <span>Error</span>
          </Button>
          <Button
            value='Warning'
            type={filterBy.indexOf('Warning') > -1 ? 'primary' : 'default'}
            onClick={() => handleFilterBy('Warning')}
          >
            <WarningOutlined className='relative top-[-3px]' />
            <span>Warning</span>
          </Button>
          <Button
            value='Information'
            type={filterBy.indexOf('Information') > -1 ? 'primary' : 'default'}
            onClick={() => handleFilterBy('Information')}
          >
            <InfoCircleOutlined className='relative top-[-3px]' />
            <span>Info</span>
          </Button>
          <Button
            value='Debug'
            type={filterBy.indexOf('Debug') > -1 ? 'primary' : 'default'}
            onClick={() => handleFilterBy('Debug')}
          >
            <CheckCircleOutlined className='relative top-[-3px]' />
            <span>Debug</span>
          </Button>
        </Button.Group>
        <div className='hidden'>
          Sort by:
          <Select
            value={sortBy}
            onChange={(value) => setSortBy(value)}
            className='ml-[6px]'
          >
            <Select.Option value='Newest'>Newest first</Select.Option>
            <Select.Option value='Oldest'>Oldest first</Select.Option>
          </Select>
        </div>
      </div>
      <div className='bg-gray-F5 relative max-h-[800px] min-h-96 w-full overflow-y-auto rounded-2xl p-8'>
        <SyncOutlined spin className='absolute left-1 top-1' />
        {logsList.map((log, index) => {
          return (
            <div
              key={log?.log_id + log?.app_log.time + index}
              className='mb-[24px] flex items-center justify-start text-sm'
            >
              <div className='w-[80px] flex-none sm:w-[160px] sm:min-w-[160px]'>
                {dayjs(log?.app_log?.time).format('YYYY/MM/DD HH:mm:ss')}
              </div>
              <div className='mx-[8px] inline-block w-[70px] flex-none text-left sm:mx-[48px] sm:w-[80px]'>
                <Tag
                  className='w-[70px] text-center sm:w-[80px]'
                  color={LogsColor[log?.app_log?.level]}
                >
                  {LogsText[log?.app_log?.level]}
                </Tag>
              </div>
              <LogsItem
                message={log?.app_log?.message}
                exception={log?.app_log?.exception}
                messageApi={messageApi}
              />
            </div>
          );
        })}
        {logsList.length === 0 && <div className='text-center'>loading...</div>}
      </div>
    </div>
  );
}
