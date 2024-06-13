import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  SearchOutlined,
  UnorderedListOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { Input, Radio, Select } from 'antd';
import { MessageInstance } from 'antd/es/message/interface';
import { useCallback, useEffect, useState } from 'react';

import { useAppSelector } from '@/store/hooks';

import { getLog } from '@/api/requestApp';

import { GetLogResponse } from '@/types/appType';

type LogsProps = {
  messageApi: MessageInstance;
};

export default function Logs({ messageApi }: LogsProps) {
  const [search, setSearch] = useState<string>('');
  const [filterBy, setFilterBy] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('Newest');
  const [logsList, setLogsList] = useState<GetLogResponse[]>([]);
  // const [filteredLogsList, setFilteredLogsList] = useState<GetLogResponse[]>([]);
  const [startTime, setStartTime] = useState<string>(new Date().toISOString());
  const [logId, setLogId] = useState<string>('');
  const { currentAppDetail, currentVersion } = useAppSelector(
    (state) => state.app
  );

  const getLogs = useCallback(async () => {
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

    if (sortBy === 'Newest') {
      setLogsList([...res, ...logsList]);
    }
    if (sortBy === 'Oldest') {
      setLogsList([...logsList, ...res]);
    }
  }, [
    currentAppDetail.appId,
    currentVersion,
    startTime,
    logsList,
    sortBy,
    logId,
  ]);

  useEffect(() => {
    // const interval = setInterval(() => {
    //   getLogs();
    // }, 5000);

    // return () => clearInterval(interval);
    getLogs();
  }, [getLogs]);

  const handleSearch = useCallback(
    (value: string) => {
      // TODO: search
      messageApi.open({
        type: 'warning',
        content: 'Search is not supported yet',
      });
      setSearch(value);
    },
    [messageApi]
  );

  const handleFilterBy = useCallback((value: string) => {
    // TODO: filter
    setFilterBy(value);
  }, []);

  const handleSortBy = useCallback((value: string) => {
    // TODO: sort
    setSortBy(value);
  }, []);

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
            onChange={(value) => handleSortBy(value)}
            className='ml-[6px]'
          >
            <Select.Option value='Newest'>Newest first</Select.Option>
            <Select.Option value='Oldest'>Oldest first</Select.Option>
          </Select>
        </div>
      </div>
      <div className='bg-gray-F5 max-h-[800px] min-h-96 w-full overflow-y-auto rounded-2xl p-8'>
        {logsList &&
          logsList.length > 0 &&
          logsList.map((log) => {
            return (
              <div key={log?.app_log?.eventId}>
                <div>{log?.app_log?.time}</div>
                <div>{log?.app_log?.level}</div>
                <div>
                  <div>{log?.app_log?.message}</div>
                  <div>{log?.app_log?.exception}</div>
                </div>
              </div>
            );
          })}
        {logsList && logsList.length === 0 && (
          <div className='text-center'>No logs</div>
        )}
      </div>
    </div>
  );
}
