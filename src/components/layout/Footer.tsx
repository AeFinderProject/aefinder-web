'use client';
import Image from 'next/image';

import UnstyledLink from '@/components/links/UnstyledLink';

export default function Footer() {
  return (
    <div className='w-full bg-white px-[40px] sm:px-[60px]'>
      <div className='border-t-gray-F0 flex h-[64px] items-center justify-between border-t'>
        <div className='text-gray-80 text-sm'>Copyright © 2024 AeFinder</div>
        <div className='flex justify-between'>
          <UnstyledLink href='https://t.me/aefinder_assistant'>
            <Image
              src='/assets/svg/telegram.svg'
              alt='telegram'
              width={24}
              height={24}
              className='mr-5'
            />
          </UnstyledLink>
          <UnstyledLink href='https://twitter.com/AeFinder_Web3'>
            <Image src='/assets/svg/x.svg' alt='x' width={24} height={24} />
          </UnstyledLink>
        </div>
      </div>
    </div>
  );
}
