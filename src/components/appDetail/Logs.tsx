import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  SearchOutlined,
  UnorderedListOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { Input, Radio, Select, Tag } from 'antd';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';

import { useThrottleCallback } from '@/lib/utils';

import { useAppSelector } from '@/store/hooks';

import { getLog } from '@/api/requestApp';

import { GetLogResponse } from '@/types/appType';

const LogsColor = {
  Debug: '#1890ff',
  Error: '#f5222d',
  Warn: '#faad14',
  Info: '#52c41a',
};

export default function Logs() {
  const [search, setSearch] = useState<string>('');
  const [filterBy, setFilterBy] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('Newest');
  const [logsList, setLogsList] = useState<GetLogResponse[]>([]);
  const [filteredLogsList, setFilteredLogsList] = useState<GetLogResponse[]>(
    []
  );
  const [startTime, setStartTime] = useState<string>(new Date().toISOString());
  const [logId, setLogId] = useState<string>('');
  const { currentAppDetail, currentVersion } = useAppSelector(
    (state) => state.app
  );

  const getLogs = async () => {
    const res = await getLog({
      appId: currentAppDetail.appId,
      version: currentVersion,
      startTime: startTime,
      logId: logId,
    });
    if (!res || !res.length) {
      return;
    }
    // get last log timestamp as the next request's startTime and logId
    setStartTime(res[res.length - 1].timestamp);
    setLogId(res[res.length - 1].id);
    // add new logs to the end
    setLogsList([...logsList, ...res]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      getLogs();
    }, 5000);

    return () => clearInterval(interval);
  });

  const handleSearch = useThrottleCallback(
    (value: string) => {
      if (value === '') {
        setFilteredLogsList([]);
        setSearch(value);
        return;
      }
      // search message.includes
      const searchedLogs = logsList.filter((log) => {
        return log?.app_log?.message.includes(value);
      });
      setFilteredLogsList(searchedLogs);
      setSearch(value);
    },
    [search]
  );

  const handleFilterBy = (value: string) => {
    if (value === 'All') {
      setFilteredLogsList([]);
      setFilterBy(value);
      return;
    }
    // filter as level value
    const filteredLogs = logsList.filter((item) => {
      return item?.app_log?.level === value;
    });
    setFilteredLogsList(filteredLogs);
    setFilterBy(value);
  };

  const handleLogsList = useCallback(() => {
    if (
      logsList &&
      sortBy === 'Newest' &&
      filteredLogsList.length === 0 &&
      logsList.length > 0
    ) {
      return logsList;
    }
    if (
      logsList &&
      sortBy === 'Oldest' &&
      filteredLogsList.length === 0 &&
      logsList.length > 0
    ) {
      return logsList.reverse();
    }
    if (
      filteredLogsList &&
      sortBy === 'Newest' &&
      filteredLogsList.length > 0
    ) {
      return filteredLogsList;
    }
    if (
      filteredLogsList &&
      sortBy === 'Oldest' &&
      filteredLogsList.length > 0
    ) {
      return filteredLogsList.reverse();
    }
    // default []
    return [];
  }, [logsList, filteredLogsList, sortBy]);

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
          <Radio.Button value='Warn'>
            <WarningOutlined /> Warn
          </Radio.Button>
          <Radio.Button value='Info'>
            <InfoCircleOutlined /> Info
          </Radio.Button>
          <Radio.Button value='Debug'>
            <CheckCircleOutlined /> Debug
          </Radio.Button>
        </Radio.Group>
        <div>
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
      <div className='bg-gray-F5 max-h-[800px] min-h-96 w-full overflow-y-auto rounded-2xl p-8'>
        {handleLogsList().map((log) => {
          return (
            <div
              key={log?.app_log?.eventId}
              className='mb-[24px] flex items-center justify-start text-sm'
            >
              <div className='w-[160px] min-w-[160px]'>
                {dayjs(log?.app_log?.time).format('YYYY/MM/DD HH:mm:ss')}
              </div>
              <Tag
                className='mx-[48px] w-[60px] text-center'
                color={LogsColor[log?.app_log?.level]}
              >
                {log?.app_log?.level}
              </Tag>
              <div className='overflow-hidden'>
                <div className='text-muted truncate-3-lines w-full max-w-[100%]'>
                  {log?.app_log?.message}
                </div>
                <div className='text-muted w-full max-w-[100%] truncate'>
                  {log?.app_log?.exception}
                </div>
              </div>
            </div>
          );
        })}
        {logsList.length === 0 && search === '' && filterBy === 'All' && (
          <div className='text-center'>No log</div>
        )}
        {filteredLogsList.length === 0 &&
          (search !== '' || filterBy !== 'All') && (
            <div className='text-center'>No match log</div>
          )}
      </div>
    </div>
  );
}
