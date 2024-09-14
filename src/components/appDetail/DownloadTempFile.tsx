import { Button, Col, Divider, Form, Input, Row } from 'antd';
import clsx from 'clsx';
import Image from 'next/image';
import { useCallback, useState } from 'react';

import Copy from '@/components/Copy';
import UnstyledLink from '@/components/links/UnstyledLink';

import { getDevTemplate } from '@/api/requestSubscription';

export default function DownloadTempFile() {
  const [downAppName, setDownAppName] = useState('');
  const [form] = Form.useForm();
  const FormItem = Form.Item;
  const [isShowLoading, setIsShowLoading] = useState(false);

  const handleDownload = useCallback(async () => {
    try {
      setIsShowLoading(true);
      const res = await getDevTemplate({ name: downAppName });
      const blob = new Blob([res], { type: 'application/zip' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${downAppName}.zip`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      setIsShowLoading(false);
    } finally {
      setIsShowLoading(false);
    }
  }, [downAppName]);

  return (
    <div className='border-gray-E0 mt-[32px] w-full rounded-md'>
      <Row gutter={24} className='w-full'>
        <Col sm={24} md={12}>
          <div className='sm:pr-[20px]'>
            <Image
              src='/assets/svg/arrow-down.svg'
              alt='arrow-down'
              width={32}
              height={32}
            />
            <div className='text-block text-dark-primaryText my-[8px] text-2xl font-medium'>
              Option 1: Set Up Using AeFinder UI
            </div>
            <div className='text-gray-80 mb-[24px] text-sm'>
              Use the project template files to get started with your
              development.
            </div>
            <div className='text-dark-primaryText mb-[8px] text-xl font-medium'>
              1. DOWNLOAD TEMPLATE
            </div>
            <div className='text-gray-80 text-sm'>
              Start by downloading the project template files.
            </div>
            <Form
              form={form}
              layout='vertical'
              className='mt-6'
              onFinish={() => handleDownload()}
            >
              <FormItem
                name='projectName'
                label='Project name'
                rules={[
                  { required: true, message: 'Please input project name!' },
                  {
                    pattern: /^[A-Za-z][A-Za-z0-9.]+$/gim,
                    message:
                      '2~20 length and name must start with a letter and can only contain letters, numbers, and dots',
                  },
                ]}
              >
                <Input
                  placeholder='Use letters or numbers only (2-20 characters)'
                  className='rounded-md'
                  minLength={2}
                  maxLength={20}
                  onChange={(e) => setDownAppName(e.target.value)}
                />
              </FormItem>
              <FormItem className='text-left'>
                <Button
                  size='large'
                  className={clsx(
                    'w-[128px]',
                    downAppName === '' && 'bg-blue-disable'
                  )}
                  type='primary'
                  htmlType='submit'
                  loading={isShowLoading}
                >
                  Download
                </Button>
              </FormItem>
            </Form>
            <div className='text-dark-primaryText mb-[8px] text-xl font-medium'>
              2. DEPLOY
            </div>
            <div className='bg-gray-F5 my-[8px] flex items-center justify-center rounded-md p-[16px]'>
              <Image
                src='/assets/svg/deploy_screenshot.svg'
                alt='deploy_screenshot'
                width={295}
                height={195}
              />
            </div>
            <div className='text-gray-80 mb-[24px] text-sm'>
              Click on the “Deploy...” button and upload your project manifest
              (JSON) and code file (DLL).
            </div>
            <div className='text-dark-primaryText mb-[8px] text-xl font-medium'>
              3. UPDATE
            </div>
            <div className='bg-gray-F5 my-[8px] flex items-center justify-center rounded-md p-[16px]'>
              <Image
                src='/assets/svg/update_screenshot.svg'
                alt='update_screenshot'
                width={291}
                height={225}
              />
            </div>
            <div className='text-gray-80 mb-[24px] text-sm sm:mb-[0px]'>
              After deployment, click the “Update” button to update your
              manifest (JSON) and code (DLL).
            </div>
          </div>
        </Col>
        <Divider type='horizontal' className='sm:hidden' />
        <Col sm={24} md={12} className='border-gray-F0 sm:border-l'>
          <div className=' sm:mt- sm:pl-[20px]'>
            <Image
              src='/assets/svg/terminal-window.svg'
              alt='terminal-window'
              width={32}
              height={32}
            />
            <div className='text-block text-dark-primaryText my-[8px] text-2xl font-medium'>
              Option 2: Set Up Using the CLI
            </div>
            <div className='mb-[24px]'>
              <UnstyledLink
                href='https://docs.aefinder.io/docs/cli'
                className='text-blue-link'
              >
                View documentation
                <Image
                  src='/assets/svg/right-arrow.svg'
                  alt='right-arrow'
                  width={24}
                  height={24}
                  className='ml-[8px] inline-block align-top'
                />
              </UnstyledLink>
            </div>
            <div className='text-dark-primaryText mb-[8px] text-xl font-medium'>
              1. INSTALL AEFINDER CLI
            </div>
            <div className='text-gray-80 text-sm'>
              Install the AeFinder CLI to begin your project setup.
            </div>
            <div className='bg-gray-F5 mb-[24px] mt-[16px]  rounded-lg px-[12px] pb-[8px] pt-[10px]'>
              <Copy
                label='Install AeFinder CLI using .NET'
                content='dotnet tool install aefinder'
                isShowCopy={true}
              />
            </div>
            <div className='text-dark-primaryText mb-[8px] text-xl font-medium'>
              2. INIT
            </div>
            <div className='text-gray-80 text-sm'>
              Initialise your AeFinder.
            </div>
            <div className='bg-gray-F5 mb-[24px] mt-[16px]  rounded-lg px-[12px] pb-[8px] pt-[10px]'>
              <Copy
                label='Install AeFinder CLI using .NET'
                content='aefinder init --name xxx --directory xxx --appid xxx --key xxx'
                isShowCopy={true}
              />
            </div>
            <div className='text-dark-primaryText mb-[8px] text-xl font-medium'>
              3. DEPLOY
            </div>
            <div className='text-gray-80 text-sm'>
              Build and deploy your AeFinder.
            </div>
            <div className='bg-gray-F5 mb-[24px] mt-[16px]  rounded-lg px-[12px] pb-[8px] pt-[10px]'>
              <Copy
                label='Deploy AeFinder via CLI'
                content='aefinder deploy --code xxx.dll --mainfest xxx.json --appid xxx --key xxx'
                isShowCopy={true}
              />
            </div>
            <div className='text-dark-primaryText mb-[8px] text-xl font-medium'>
              4. UPDATE
            </div>
            <div className='text-gray-80 text-sm'>
              Use the CLI to update your AeFinder’s code and manifest.
            </div>
            <div className='bg-gray-F5 mb-[16px] mt-[16px]  rounded-lg px-[12px] pb-[8px] pt-[10px]'>
              <Copy
                label='Update Code via CLI'
                content='aefinder update --version xxx --code xxx.dll --appid xxx --key xxx'
                isShowCopy={true}
              />
            </div>
            <div className='bg-gray-F5 mb-[24px] mt-[16px]  rounded-lg px-[12px] pb-[8px] pt-[10px]'>
              <Copy
                label='Update Manifest via CLI'
                content='aefinder update --version xxx --mainfest xxx.json --appid xxx --key xxx'
                isShowCopy={true}
              />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}
