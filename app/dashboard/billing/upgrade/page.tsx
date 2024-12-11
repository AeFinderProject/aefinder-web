'use client';

import { ExclamationCircleOutlined, LeftOutlined } from '@ant-design/icons';
import type { SliderSingleProps } from 'antd';
import { Button, Col, Divider, Row, Slider, Tag } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const marks: SliderSingleProps['marks'] = {
  10: {
    style: {
      fontSize: '12px',
      color: '#808080',
    },
    label: <strong>10K</strong>,
  },
  100: {
    style: {
      fontSize: '12px',
      color: '#808080',
    },
    label: <strong>100K</strong>,
  },
  200: {
    style: {
      fontSize: '12px',
      color: '#808080',
    },
    label: <strong>200K</strong>,
  },
};

export default function Upgrade() {
  const router = useRouter();

  return (
    <div className='px-[16px] pb-[36px] sm:px-[40px]'>
      <div className='border-gray-F0 flex h-[120px] flex-col items-start justify-center border-b'>
        <div>
          <LeftOutlined
            className='relative top-[-7px] mr-[16px] cursor-pointer align-middle text-sm'
            onClick={() => router.back()}
          />
          <span className='text-3xl text-black'>Upgrade Plan</span>
        </div>
      </div>
      <div className='mt-[24px]'>
        <Row gutter={24}>
          <Col span={14}>
            <div className='mb-[28px] flex items-center justify-between'>
              <div className='text-xl font-medium text-black'>
                <Image
                  src='/assets/svg/step1.svg'
                  alt='step1'
                  width={24}
                  height={24}
                  className='relative top-[-2px] mr-[16px] inline-block align-middle'
                />
                Estimated number of monthly queries
              </div>
              <div>
                <span className='text-dark-normal'>200,000</span>
                <span className='text-blue-link ml-[16px] cursor-pointer'>
                  Max
                </span>
              </div>
            </div>
            <Slider
              defaultValue={50}
              min={10}
              max={200}
              step={10}
              marks={marks}
            />
            <div className='text-gray-80 mt-[20px] text-sm'>
              *First 100,000 is free, subsequent queries are chargeable at
              $4/100,000 queries
            </div>
            <Divider className='my-[35px]' />
            <div className='mb-[28px] text-xl font-medium text-black'>
              <Image
                src='/assets/svg/step2.svg'
                alt='step2'
                width={24}
                height={24}
                className='relative top-[-2px] mr-[16px] inline-block align-middle'
              />
              Prepay for
            </div>
            <div>
              <Button className='border-blue-link text-blue-link border'>
                1 Month
              </Button>
              <Button className='border-blue-link text-blue-link mx-[10px] border'>
                3 Month
              </Button>
              <Button className='border-blue-link text-blue-link border'>
                6 Month
              </Button>
            </div>
            <Divider className='my-[35px]' />
            <div className='mb-[28px] text-xl font-medium text-black'>
              <Image
                src='/assets/svg/step3.svg'
                alt='step3'
                width={24}
                height={24}
                className='relative top-[-2px] mr-[16px] inline-block align-middle'
              />
              Confirm wallet
            </div>
            <div className='mb-[20px]'>
              <span className='text-gray-80 mr-[16px]'>Pay with: </span>
              <Button>
                <Image
                  src='/assets/svg/user.svg'
                  alt='user'
                  width={18}
                  height={18}
                  className='hover:text-blue-link mr-3 inline-block'
                />
                <span>e055....7286</span>
              </Button>
            </div>
            <div className='mb-[8px]'>
              <span className='text-gray-80 mr-[16px] text-sm'>
                Billing balance:
              </span>
              <span className='text-dark-normal mr-[2px] text-sm'>
                $20.23 USDT{' '}
              </span>
              <span className='text-gray-80 text-sm'>
                (Locked: $20.23 USDT)
              </span>
            </div>
            <div>
              <span className='text-gray-80 mr-[16px] text-sm'>
                Wallet balance:
              </span>
              <span className='text-dark-normal mr-[2px] text-sm'>
                $20.12 USDT{' '}
              </span>
              <span className='text-blue-link cursor-pointer text-sm'>
                Buy USDT
                <Image
                  src='/assets/svg/right-arrow.svg'
                  alt='arrow'
                  width={16}
                  height={16}
                  className='text-blue-link ml-[4px] inline-block'
                />
              </span>
            </div>
            <Tag
              icon={
                <ExclamationCircleOutlined className='relative top-[-3px]' />
              }
              color='processing'
              className='my-[8px] h-[40px] w-full leading-10'
            >
              <span className='text-gray-80 text-sm'>
                You will be able to withdraw your unlocked balance at any time
              </span>
            </Tag>
            <Tag
              icon={
                <ExclamationCircleOutlined className='relative top-[-3px]' />
              }
              color='warning'
              className='h-[40px] w-full leading-10'
            >
              <span className='text-gray-80 text-sm'>
                You don’t have enough billing balance. Please
                <span className='text-blue-link mx-[4px] cursor-pointer text-sm'>
                  top up your balance
                </span>
                to proceed.
              </span>
            </Tag>
            <Divider className='my-[35px]' />
            <div className='align-center mb-[35px] flex justify-between'>
              <div>
                <div className='text-gray-80 text-sm'>Est. Monthly Cost*</div>
                <div className='text-dark-normal'>$61.60/month</div>
              </div>
              <Button type='primary' disabled>
                Insufficient billing balance
              </Button>
            </div>
            <div className='text-gray-80 text-sm'>
              * This amount will be locked in your Billing Balance and cannot be
              withdrawn. We will charge the exact amount consumed at the end of
              each month. Any unused funds in your Billing Balance will then be
              unlocked and available for withdrawal.
            </div>
          </Col>
          <Col span={9} offset={1}>
            <div className='text-xl font-medium text-black'>
              Your Plan Details
            </div>
            <div className='text-gray-80 my-[16px] text-sm'>
              Growth plan will also include 100K free monthly queries.
            </div>
            <div className='bg-gray-F5 rounded-lg p-[20px]'>
              <div className='mb-[20px] flex justify-between'>
                <div className='text-gray-80 text-sm'>Est. Queries</div>
                <div className='text-dark-normal'>$4/month</div>
              </div>
              <div className='flex justify-between'>
                <div className='text-gray-80 text-sm'>Months</div>
                <div className='text-dark-normal'>3</div>
              </div>
              <Divider />
              <div className='flex justify-between'>
                <div className='text-gray-80 text-sm'>Est. Monthly Cost</div>
                <div className='text-dark-normal'>$32.80/month</div>
              </div>
              <Divider />
              <div className='flex justify-between'>
                <div className='text-dark-normal'>Est. Monthly Cost</div>
                <div className='text-dark-normal'>$32.80/month</div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
