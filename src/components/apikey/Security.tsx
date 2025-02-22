import type { GetProp } from 'antd';
import {
  Button,
  Checkbox,
  Col,
  Divider,
  Input,
  message,
  Modal,
  Row,
  Select,
} from 'antd';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { useDebounceCallback } from '@/lib/utils';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setApikeyDetail } from '@/store/slices/appSlice';

import {
  addAuthorisedAeIndexer,
  addAuthorisedDomain,
  deleteAuthorisedAeIndexer,
  deleteAuthorisedDomain,
  getAeIndexerMyList,
  getApiKeyDetail,
  setAuthorisedApis,
} from '@/api/requestAPIKeys';

import { ApiType, AuthorisedAeIndexers } from '@/types/apikeyType';

const Option = Select.Option;

export default function Security() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [messageApi, contextHolder] = message.useMessage();
  const isMobile = window?.innerWidth < 640;

  const [loading, setLoading] = useState(false);
  const [isShowAddAeIndexerModal, setIsShowAddAeIndexerModal] = useState(false);
  const [isShowAddDomainModal, setIsShowAddDomainModal] = useState(false);
  const [isShowEditAPIModal, setIsShowEditAPIModal] = useState(false);

  const apikeyDetail = useAppSelector((state) => state.app.apikeyDetail);
  console.log('apikeyDetail', apikeyDetail);

  const [currentAppId, setCurrentAppId] = useState(null);
  const [currentDomain, setCurrentDomain] = useState<string>('');
  const [currentApi, setCurrentApi] = useState<number[]>([]);
  const [currentMyAeindexersList, setCurrentMyAeindexersList] = useState<
    AuthorisedAeIndexers[]
  >([]);

  const getApiKeyDetailTemp = useCallback(async () => {
    if (!id) {
      return;
    }
    const res = await getApiKeyDetail({ id });
    console.log('res', res);
    dispatch(setApikeyDetail(res));
  }, [dispatch, id]);

  const getCurrentMyAeindexersListTemp = useCallback(
    async (keyword: string) => {
      const { items } = await getAeIndexerMyList({ keyword });
      setCurrentMyAeindexersList(items);
    },
    []
  );

  useEffect(() => {
    getCurrentMyAeindexersListTemp('');
  }, [getCurrentMyAeindexersListTemp, isShowAddAeIndexerModal]);

  const handleAeIndexerSearch = useDebounceCallback(
    (keyword: string) => {
      getCurrentMyAeindexersListTemp(keyword);
    },
    [getCurrentMyAeindexersListTemp]
  );

  const handleDeleteAeIndexer = useCallback(
    async (appId: string) => {
      const res = await deleteAuthorisedAeIndexer({
        id: apikeyDetail?.id,
        appIds: [appId],
      });
      if (res) {
        messageApi.success('Delete Authorise AeIndexers successfully');
        setTimeout(() => {
          getApiKeyDetailTemp();
        }, 1000);
      }
    },
    [messageApi, getApiKeyDetailTemp, apikeyDetail?.id]
  );

  const handleDeleteDomain = useCallback(
    async (domain: string) => {
      const res = await deleteAuthorisedDomain({
        id: apikeyDetail?.id,
        domains: [domain],
      });
      if (res) {
        messageApi.success('Delete Authorise Domain successfully');
        setTimeout(() => {
          getApiKeyDetailTemp();
        }, 1000);
      }
    },
    [messageApi, getApiKeyDetailTemp, apikeyDetail?.id]
  );

  const handleDeleteAPI = useCallback(
    async (deleteApi: number) => {
      // pre apis obj
      const apis: { [key: number]: boolean } = {
        0: false,
        1: false,
        2: false,
      };
      const tempAipArray = [...(apikeyDetail?.authorisedApis || [])];
      const index = tempAipArray?.indexOf(deleteApi);
      if (index !== -1) {
        tempAipArray.splice(index, 1);
      }
      console.log('tempAipArray', tempAipArray);
      const tempList = [0, 1, 2];
      tempList.forEach((item) => {
        if (
          tempAipArray.findIndex((currentItem) => currentItem === item) > -1
        ) {
          apis[item] = true;
        }
      });
      console.log('apis', apis);
      const res = await setAuthorisedApis({
        id: apikeyDetail?.id,
        apis: apis,
      });
      if (res) {
        messageApi.success('Delete Authorise API successfully');
        setTimeout(() => {
          setIsShowEditAPIModal(false);
          getApiKeyDetailTemp();
        }, 1000);
      }
    },
    [
      messageApi,
      getApiKeyDetailTemp,
      apikeyDetail?.id,
      apikeyDetail?.authorisedApis,
    ]
  );

  const handleCancel = useCallback(() => {
    setCurrentAppId(null);
    setCurrentDomain('');
    setLoading(false);
    setIsShowAddAeIndexerModal(false);
    setIsShowAddDomainModal(false);
    setIsShowEditAPIModal(false);
  }, []);

  const handleAuthAeIndexers = useDebounceCallback(async () => {
    // step 1 check value, step2 check if copy, step3 addAuthorisedAeIndexer
    if (!currentAppId) {
      messageApi.info('Please select AeIndexers!');
      return;
    }
    if (
      apikeyDetail?.authorisedAeIndexers?.some(
        (item) => item.appId === currentAppId
      )
    ) {
      messageApi.warning('This AeIndexers had been added');
      return;
    }
    try {
      setLoading(true);
      const res = await addAuthorisedAeIndexer({
        id: apikeyDetail?.id,
        appIds: [currentAppId],
      });
      if (res) {
        messageApi.success('Authorise AeIndexers successfully');
        setTimeout(() => {
          setIsShowAddAeIndexerModal(false);
          setCurrentAppId(null);
          getApiKeyDetailTemp();
        }, 1000);
      }
    } finally {
      setLoading(false);
    }
  }, [
    messageApi,
    getApiKeyDetailTemp,
    apikeyDetail?.id,
    currentAppId,
    apikeyDetail?.authorisedAeIndexers,
  ]);

  const handleAuthDomain = useDebounceCallback(async () => {
    const urlPattern =
      /^((https?:\/\/)?(\*\.|[\w.-]+\.)+)([a-z]{2,6})(\/[\w.-]*)*\/?$/i;
    const isValidUrl = urlPattern.test(currentDomain);
    if (!isValidUrl) {
      messageApi.info('Please input a valid domain!');
      return;
    }
    if (
      apikeyDetail?.authorisedDomains?.some((item) => item === currentDomain)
    ) {
      messageApi.warning('This domain had been added');
      return;
    }
    try {
      setLoading(true);
      const res = await addAuthorisedDomain({
        id: apikeyDetail?.id,
        domains: [currentDomain],
      });
      if (res) {
        messageApi.success('Authorise Domain successfully');
        setTimeout(() => {
          setIsShowAddDomainModal(false);
          setCurrentDomain('');
          getApiKeyDetailTemp();
        }, 1000);
      }
    } finally {
      setLoading(false);
    }
  }, [
    messageApi,
    getApiKeyDetailTemp,
    apikeyDetail?.id,
    currentDomain,
    apikeyDetail?.authorisedDomains,
  ]);

  const handleAuthAPI = useDebounceCallback(async () => {
    // pre apis obj
    const apis: { [key: number]: boolean } = {
      0: false,
      1: false,
      2: false,
    };
    const tempList = [0, 1, 2];
    tempList.forEach((item) => {
      if (currentApi.findIndex((currentItem) => currentItem === item) > -1) {
        apis[item] = true;
      }
    });
    console.log('apis', apis);
    try {
      setLoading(true);
      const res = await setAuthorisedApis({
        id: apikeyDetail?.id,
        apis: apis,
      });
      if (res) {
        messageApi.success('Authorise API successfully');
        setTimeout(() => {
          setCurrentApi([]);
          setIsShowEditAPIModal(false);
          getApiKeyDetailTemp();
        }, 1000);
      }
    } finally {
      setLoading(false);
    }
  }, [messageApi, getApiKeyDetailTemp, apikeyDetail?.id, currentApi]);

  const onCheckBoxChange: GetProp<typeof Checkbox.Group, 'onChange'> = (
    checkedValues
  ) => {
    console.log('checkedValues', checkedValues);
    setCurrentApi(checkedValues as (0 | 1 | 2)[]);
  };

  return (
    <div>
      {contextHolder}
      <Row gutter={24} className='mt-[32px]'>
        <Col span={12} className='pr-[8px]'>
          <div className='text-dark-normal mb-[8px] text-2xl font-medium'>
            Authorised AeIndexers
          </div>
          <div className='text-gray-80 mb-[30px] leading-5'>
            To limit usage, restrict to specific AeIndexer. Only authorized
            AeIndexers will be able to use the API Key.
          </div>
          <div className='border-gray-E0 rounded-lg border px-[4px] pb-[12px] pt-[32px] sm:px-[24px]'>
            {apikeyDetail?.authorisedAeIndexers?.length === 0 && (
              <div className='text-center'>
                <div className='text-gray-80 mb-[8px] text-xs'>
                  API Key can be used on any AeIndexers
                </div>
                <Button
                  className='bg-gray-F5 text-dark-normal text-sm'
                  onClick={() => setIsShowAddAeIndexerModal(true)}
                >
                  {isMobile ? 'Add Restrict' : 'Restrict to a AeIndexer'}
                </Button>
              </div>
            )}
            {apikeyDetail?.authorisedAeIndexers?.length > 0 && (
              <div>
                <div className='ml-[12px]'>AeIndexers</div>
                <Divider className='my-[12px]' />
                {apikeyDetail?.authorisedAeIndexers?.map(
                  (item: AuthorisedAeIndexers) => {
                    return (
                      <div
                        key={item.appId}
                        className='mb-[12px] flex items-center justify-between px-[12px] py-[6px] hover:bg-gray-50'
                      >
                        <div className='flex items-center justify-start'>
                          <div className='bg-gray-D6 mr-[14px] h-[22px] w-[22px] rounded-3xl'></div>
                          <div>
                            <div className='text-dark-normal mb-[4px] text-sm'>
                              {item.appName}
                            </div>
                            <div className='text-gray-80 text-xs'>
                              {item.appId}
                            </div>
                          </div>
                        </div>
                        <Image
                          src='/assets/svg/delete.svg'
                          alt='delete'
                          width={22}
                          height={22}
                          onClick={() => handleDeleteAeIndexer(item.appId)}
                          className='cursor-pointer'
                        />
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </div>
          {apikeyDetail?.authorisedAeIndexers?.length > 0 && (
            <Button
              className='mt-[30px] w-full'
              type='primary'
              size='large'
              onClick={() => setIsShowAddAeIndexerModal(true)}
            >
              Auth AeIndexers
            </Button>
          )}
        </Col>
        <Col span={12} className='m-h-[300px] pl-[8px]'>
          <div className='text-dark-normal mb-[8px] text-2xl font-medium'>
            Authorised Domains
          </div>
          <div className='text-gray-80 mb-[30px] leading-5'>
            To limit usage, restrict to specific domains. Only authorized
            domains will be able to use the API Key.
          </div>
          <div className='border-gray-E0 rounded-lg border px-[4px] pb-[12px] pt-[32px] sm:px-[24px]'>
            {apikeyDetail?.authorisedDomains?.length === 0 && (
              <div className='text-center'>
                <div className='text-gray-80 mb-[8px] text-xs'>
                  API Key can be used on any Domain
                </div>
                <Button
                  className='bg-gray-F5 text-dark-normal text-sm'
                  onClick={() => setIsShowAddDomainModal(true)}
                >
                  {isMobile ? 'Add Restrict' : 'Restrict to a Domain'}
                </Button>
              </div>
            )}
            {apikeyDetail?.authorisedDomains?.length > 0 && (
              <div>
                <div className='ml-[12px]'>Domains</div>
                <Divider className='my-[12px]' />
                {apikeyDetail?.authorisedDomains?.map((item) => {
                  return (
                    <div
                      key={item}
                      className='mb-[12px] flex items-center justify-between px-[12px] py-[6px] hover:bg-gray-50'
                    >
                      <div className='text-dark-normal text-sm'>{item}</div>
                      <Image
                        src='/assets/svg/delete.svg'
                        alt='delete'
                        width={22}
                        height={22}
                        onClick={() => handleDeleteDomain(item)}
                        className='cursor-pointer'
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          {apikeyDetail?.authorisedDomains?.length > 0 && (
            <Button
              className='mt-[30px] w-full'
              type='primary'
              size='large'
              onClick={() => setIsShowAddDomainModal(true)}
            >
              Auth Domains
            </Button>
          )}
        </Col>
      </Row>
      <Row gutter={24} className='mt-[32px]'>
        <Col span={12} className='pr-[8px]'>
          <div className='text-dark-normal mb-[8px] text-2xl font-medium'>
            Authorised AeFinder APIs
          </div>
          <div className='text-gray-80 mb-[30px] leading-5'>
            To limit usage, restrict to specific AeFinder APIs. Only authorized
            APIs will be able to use the API Key.
          </div>
          <div className='border-gray-E0 rounded-lg border px-[4px] pb-[12px] pt-[32px] sm:px-[24px]'>
            {apikeyDetail?.authorisedApis?.length === 0 && (
              <div className='text-center'>
                <div className='text-gray-80 mb-[8px] text-xs'>
                  API Key can be used on any APIs
                </div>
                <Button
                  className='bg-gray-F5 text-dark-normal text-sm'
                  onClick={() => setIsShowEditAPIModal(true)}
                >
                  Restrict to a API
                </Button>
              </div>
            )}
            {apikeyDetail?.authorisedApis?.length > 0 && (
              <div>
                <div className='ml-[12px]'>APIs</div>
                <Divider className='my-[12px]' />
                {apikeyDetail?.authorisedApis?.map((item) => {
                  return (
                    <div
                      key={item}
                      className='mb-[12px] flex items-center justify-between px-[12px] py-[6px] hover:bg-gray-50'
                    >
                      <div className='text-dark-normal text-sm'>
                        {ApiType[item]}
                      </div>
                      <Image
                        src='/assets/svg/delete.svg'
                        alt='delete'
                        width={22}
                        height={22}
                        onClick={() => handleDeleteAPI(item)}
                        className='cursor-pointer'
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          {apikeyDetail?.authorisedApis?.length > 0 && (
            <Button
              className='mt-[30px] w-full'
              type='primary'
              size='large'
              onClick={() => setIsShowEditAPIModal(true)}
            >
              Auth APIs
            </Button>
          )}
        </Col>
        <Col span={12} className='pl-[8px]'></Col>
      </Row>
      <Modal
        title=''
        open={isShowAddAeIndexerModal}
        onCancel={handleCancel}
        className='p-[50px]'
        destroyOnClose
        footer={false}
      >
        <div className='text-gray-80 mb-[4px] mt-[24px] text-xs'>
          {apikeyDetail?.name}
        </div>
        <div className='text-dark-normal mb-[24px] font-medium'>
          Authorise AeIndexers
        </div>
        <div>Select Auth AeIndexers</div>
        <Select
          className='h-[60px] w-full py-[12px]'
          value={currentAppId}
          onChange={(value) => setCurrentAppId(value)}
          placeholder='Select Auth AeIndexers'
          showSearch
          onSearch={(value) => handleAeIndexerSearch(value)}
        >
          {currentMyAeindexersList?.map((item: AuthorisedAeIndexers) => {
            return (
              <Option key={item.appId} value={item.appId}>
                {item.appName}
              </Option>
            );
          })}
        </Select>
        <div className='mt-[24px] flex items-center  justify-between'>
          <Button className='w-[32%]' size='large' onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            className='w-[65%]'
            size='large'
            type='primary'
            onClick={handleAuthAeIndexers}
            loading={loading}
          >
            Auth AeIndexers
          </Button>
        </div>
      </Modal>
      <Modal
        title=''
        open={isShowAddDomainModal}
        onCancel={handleCancel}
        className='p-[50px]'
        destroyOnClose
        footer={false}
      >
        <div className='text-gray-80 mb-[4px] mt-[24px] text-xs'>
          {apikeyDetail?.name}
        </div>
        <div className='text-dark-normal mb-[24px] font-medium'>
          Authorise Domain
        </div>
        <Input
          placeholder='Domain'
          className='mb-[4px] w-full rounded-md'
          size='large'
          value={currentDomain}
          onChange={(e) => setCurrentDomain(e.target.value)}
        />
        <div className='text-gray-80 text-xs'>
          Note: You can authorise all subdomains using a wildcard *.example.com
        </div>
        <div className='mt-[24px] flex items-center  justify-between'>
          <Button className='w-[32%]' size='large' onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            className='w-[65%]'
            size='large'
            type='primary'
            onClick={handleAuthDomain}
            loading={loading}
          >
            Auth Domains
          </Button>
        </div>
      </Modal>
      <Modal
        title=''
        open={isShowEditAPIModal}
        onCancel={handleCancel}
        className='p-[50px]'
        destroyOnClose
        footer={false}
      >
        <div className='text-gray-80 mb-[4px] mt-[24px] text-xs'>
          {apikeyDetail?.name}
        </div>
        <div className='text-dark-normal mb-[24px] font-medium'>
          Authorise AeFinder APIs
        </div>
        <div>
          <Checkbox.Group
            className='w-full'
            defaultValue={apikeyDetail?.authorisedApis}
            onChange={onCheckBoxChange}
          >
            <Row>
              <Col span={24} key={0}>
                <Checkbox value={0}>{ApiType[0]}</Checkbox>
              </Col>
              <Col span={24} key={1}>
                <Checkbox value={1}>{ApiType[1]}</Checkbox>
              </Col>
              <Col span={24} key={2}>
                <Checkbox value={2}>{ApiType[2]}</Checkbox>
              </Col>
            </Row>
          </Checkbox.Group>
        </div>
        <div className='mt-[24px] flex items-center  justify-between'>
          <Button className='w-[48%]' size='large' onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            className='w-[48%]'
            size='large'
            type='primary'
            onClick={handleAuthAPI}
            loading={loading}
          >
            Confirm
          </Button>
        </div>
      </Modal>
    </div>
  );
}
