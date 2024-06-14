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
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import { useCallback, useEffect, useState } from 'react';

import { useThrottleCallback } from '@/lib/utils';

import { useAppSelector } from '@/store/hooks';

import { getLog } from '@/api/requestApp';

import { GetLogResponse } from '@/types/appType';

const LogsColor = {
  Debug: '#1890ff',
  Error: '#f5222d',
  Warn: '#faad14',
  Information: '#52c41a',
};

const LogsText = {
  Debug: 'Debug',
  Error: 'Error',
  Warn: 'Warn',
  Information: 'Info',
};

dayjs.extend(utc);
dayjs.extend(customParseFormat);

export default function Logs() {
  const [search, setSearch] = useState<string>('');
  const [filterBy, setFilterBy] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('Newest');
  const [logsList, setLogsList] = useState<GetLogResponse[]>([]);
  const [filteredLogsList, setFilteredLogsList] = useState<GetLogResponse[]>(
    []
  );
  const [startTime, setStartTime] = useState<string>(
    dayjs().utc().format('YYYY-MM-DDTHH:mm:ss.SSSSSS[Z]')
  );
  const [logId, setLogId] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const { currentAppDetail, currentVersion } = useAppSelector(
    (state) => state.app
  );

  useEffect(() => {
    if (search === '' && filterBy === 'All') {
      setIsSearching(false);
    }
    if (search !== '' || filterBy !== 'All') {
      setIsSearching(true);
    }
  }, [search, filterBy]);

  const handleSearch = useThrottleCallback(
    (value: string) => {
      setFilterBy('All');
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
    [search, filterBy]
  );

  const handleFilterBy = (value: string) => {
    // clear search first
    setSearch('');
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
    if (!isSearching) {
      return sortBy === 'Newest' ? logsList : logsList.reverse();
    }

    if (isSearching) {
      return sortBy === 'Newest'
        ? filteredLogsList
        : filteredLogsList.reverse();
    }

    // default []
    return [];
  }, [logsList, filteredLogsList, sortBy, isSearching]);

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
    setStartTime(res[0].timestamp);
    setLogId(res[0].log_id);
    // add new logs to the end
    let tempList = [...res, ...logsList];
    if (tempList.length > 5000) {
      tempList = [...tempList.slice(0, 5000)];
    }
    setLogsList(tempList);
  };

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
          <Radio.Button value='Warn'>
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
        {handleLogsList().map((log, index) => {
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

              <div className='overflow-hidden'>
                <div className='truncate-3-lines w-full max-w-[100%] text-left'>
                  {log?.app_log?.message}
                </div>
                <div className='text-muted w-full max-w-[100%] truncate text-left'>
                  {log?.app_log?.exception}
                </div>
              </div>
            </div>
          );
        })}
        {logsList.length === 0 && !isSearching && (
          <div className='text-center'>No log</div>
        )}
        {filteredLogsList.length === 0 && isSearching && (
          <div className='text-center'>No match log</div>
        )}
      </div>
    </div>
  );
}
