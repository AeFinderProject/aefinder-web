import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  SearchOutlined,
  SyncOutlined,
  UnorderedListOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { Input, Radio, Select, Tag } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import { useThrottleCallback } from '@/lib/utils';

import { useAppSelector } from '@/store/hooks';

import { getLog } from '@/api/requestApp';
import { LogsColor, LogsText } from '@/constant';

import LogsItem from './LogsItem';

import { GetLogResponse } from '@/types/appType';

export default function Logs() {
  const [search, setSearch] = useState<string>('');
  const [filterBy, setFilterBy] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('Newest');
  const [logsList, setLogsList] = useState<GetLogResponse[]>([]);
  const [startTime, setStartTime] = useState<string>('');
  const [logId, setLogId] = useState<string>('');
  const { currentAppDetail, currentVersion } = useAppSelector(
    (state) => state.app
  );

  const handleSearch = useThrottleCallback((value) => {
    setLogsList([]);
    setStartTime('');
    setLogId('');
    setSearch(value);
  }, []);

  const handleFilterBy = useThrottleCallback((value) => {
    setLogsList([]);
    setStartTime('');
    setLogId('');
    setFilterBy(value);
  }, []);

  useEffect(() => {
    // init params when currentVersion change
    setSearch('');
    setFilterBy('All');
    setLogsList([]);
    setStartTime('');
    setLogId('');
  }, [currentVersion]);

  const getLogs = useThrottleCallback(async () => {
    const res = await getLog({
      appId: currentAppDetail.appId,
      version: currentVersion,
      startTime: startTime,
      logId: logId,
      searchKeyWord: search,
      level: filterBy === 'All' ? '' : filterBy,
    });
    if (!res || !res.length) {
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
  }, [
    currentAppDetail.appId,
    currentVersion,
    startTime,
    logId,
    search,
    filterBy,
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      getLogs();
    }, 5000);

    return () => clearInterval(interval);
  });

  return (
    <div>
      <div className='mb-[16px] flex items-center justify-between'>
        <Input
          placeholder='Search logs'
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          style={{
            width: 200,
            height: 32,
            borderColor: '#808080',
            borderRadius: '8px',
          }}
          prefix={<SearchOutlined />}
        />
        <Radio.Group
          value={filterBy}
          onChange={(e) => handleFilterBy(e.target.value)}
        >
          <Radio.Button value='All'>
            <UnorderedListOutlined /> All
          </Radio.Button>
          <Radio.Button value='Error'>
            <ExclamationCircleOutlined /> Error
          </Radio.Button>
          <Radio.Button value='Warning'>
            <WarningOutlined /> Warn
          </Radio.Button>
          <Radio.Button value='Information'>
            <InfoCircleOutlined /> Info
          </Radio.Button>
          <Radio.Button value='Debug'>
            <CheckCircleOutlined /> Debug
          </Radio.Button>
        </Radio.Group>
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
              <div className='w-[160px] min-w-[160px]'>
                {dayjs(log?.app_log?.time).format('YYYY/MM/DD HH:mm:ss')}
              </div>
              <div className='mx-[48px] inline-block w-[80px] text-left'>
                <Tag
                  className='w-[80px] text-center'
                  color={LogsColor[log?.app_log?.level]}
                >
                  {LogsText[log?.app_log?.level]}
                </Tag>
              </div>
              <LogsItem
                message={log?.app_log?.message}
                exception={log?.app_log?.exception}
              />
            </div>
          );
        })}
        {logsList.length === 0 && <div className='text-center'>loading...</div>}
      </div>
    </div>
  );
}
