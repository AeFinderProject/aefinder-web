import { Button, Form, Input } from 'antd';
import clsx from 'clsx';
import Image from 'next/image';
import { useCallback, useState } from 'react';

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
    <div className='border-gray-E0 mt-5 flex items-center justify-center rounded-md border'>
      <div className='w-[370px] text-center'>
        <div className='mt-8 text-xs font-medium'>GET STARTED</div>
        <Image
          src='/assets/svg/download.svg'
          alt='download'
          width={72}
          height={110}
          className='my-4 inline-block'
        />
        <div className='text-block mb-2 text-2xl font-medium'>
          Download project template files
        </div>
        <div className='text-gray-80 mb-4 text-sm'>
          Use the project template files to get started with your development.
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
          <FormItem className='text-center'>
            <Button
              size='large'
              className={clsx(
                'w-full',
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
      </div>
    </div>
  );
}
