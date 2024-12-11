'use client';

import { LeftOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Input, InputNumber, Row } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Withdraw() {
  const router = useRouter();

  return (
    <div className='px-[16px] pb-[40px] sm:px-[40px]'>
      <div className='border-gray-F0 flex h-[120px] flex-col items-start justify-center border-b'>
        <div>
          <LeftOutlined
            className='relative top-[-7px] mr-[16px] cursor-pointer align-middle text-sm'
            onClick={() => router.back()}
          />
          <span className='text-3xl text-black'>Withdraw Assets</span>
        </div>
      </div>
      <Row gutter={24} className='mt-[24px]'>
        <Col span={14} offset={5}>
          <div className='mb-[20px] text-xl font-medium text-black'>
            <Image
              src='/assets/svg/step1.svg'
              alt='step1'
              width={24}
              height={24}
              className='relative top-[-2px] mr-[16px] inline-block align-middle'
            />
            Withdraw
          </div>
          <div className='border-gray-E0 rounded-lg border px-[12px] py-[18px]'>
            <div className='mb-[18px]'>
              <span className='text-gray-80'>Form</span>
              <Image
                src='/assets/svg/coin-icon/aelf-chain.svg'
                alt='aelf'
                width={24}
                height={24}
                className='relative top-[-2px] ml-[20px] mr-[4px] inline-block align-middle'
              />
              <span className='text-dark-normal font-medium'>
                aelf dAppChain
              </span>
            </div>
            <div>
              <Image
                src='/assets/svg/coin-icon/usdt-chain.svg'
                alt='usdt'
                width={24}
                height={24}
                className='relative top-[-4px] inline-block align-middle'
              />
              <span className='text-dark-normal mx-[8px] text-xl'>USDT</span>
              <span className='text-gray-80 text-sm'>Tether USD</span>
            </div>
          </div>
          <Divider className='my-[35px]' />
          <div className='mb-[20px] text-xl font-medium text-black'>
            <Image
              src='/assets/svg/step2.svg'
              alt='step2'
              width={24}
              height={24}
              className='relative top-[-2px] mr-[16px] inline-block align-middle'
            />
            Calculator
          </div>
          <div className='border-gray-E0 mb-[20px] rounded-lg border px-[12px] py-[18px]'>
            <div className='text-gray-80'>Withdrawal Address</div>
            <Input
              placeholder='Enter an address'
              size='large'
              className='my-[18px] w-full rounded-lg'
            />
          </div>
          <div className='border-gray-E0 mb-[35px] rounded-lg border px-[12px] py-[18px]'>
            <div className='text-gray-80'>Withdrawal Amount</div>
            <InputNumber
              addonAfter='USDT'
              size='large'
              className='my-[18px] w-full'
            />
            <div className='mb-[18px]'>
              <span className='text-gray-80 text-sm'>Estimated Gas Fee: </span>
              <span className='text-dark-normal text-sm'>1 ELF</span>
            </div>
            <div>
              <span className='text-gray-80 text-sm'>Transaction Fee: </span>
              <span className='text-dark-normal text-sm'>1 ELF</span>
            </div>
          </div>
          <Button type='primary' className='w-full' size='large'>
            Withdraw
          </Button>
        </Col>
      </Row>
    </div>
  );
}
