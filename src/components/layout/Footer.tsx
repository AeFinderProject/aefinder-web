'use client';
import Image from 'next/image';

import UnstyledLink from '@/components/links/UnstyledLink';

export default function Footer() {
  return (
    <div className='w-full'>
      <div className='bg-gray-F7 flex h-[94px] flex-col items-start justify-center px-[40px]  sm:h-[64px] sm:flex-row sm:items-center sm:justify-between'>
        <div className='text-gray-80 mb-[8px] text-sm leading-[22px] sm:mb-0'>
          Copyright © 2024 AeIndexer
        </div>
        <div className='flex justify-between'>
          <UnstyledLink href='https://t.me/aefinder_assistant'>
            <Image
              src='/assets/svg/telegram.svg'
              alt='telegram'
              width={24}
              height={24}
              className='mr-[22px]'
              style={{ width: '24px', height: '24px' }}
            />
          </UnstyledLink>
          <UnstyledLink href='https://twitter.com/AeFinder_Web3'>
            <Image
              src='/assets/svg/x.svg'
              alt='x'
              width={24}
              height={24}
              style={{ width: '24px', height: '24px' }}
            />
          </UnstyledLink>
        </div>
      </div>
    </div>
  );
}
