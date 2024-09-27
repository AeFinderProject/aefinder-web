import { Image } from 'antd';

type TourStepProps = {
  readonly step: 1 | 2 | 3;
};

export default function TourStep({ step }: TourStepProps) {
  return (
    <div className='bg-blue-bg flex w-[380px] flex-col rounded-lg sm:h-[540px] sm:w-[780px]  sm:flex-row'>
      <div className='w-[380px] rounded-l-lg bg-white p-[24px]'>
        <div className='text-dark-normal text-[24px] font-medium leading-8'>
          Welcome to AeFinder!
        </div>
        <div className='text-gray-80 mt-[16px] text-[16px] leading-6'>
          Unlock the full potential of building on the aelf blockchain with our
          powerful tools tailored for Web3 developers.
        </div>
      </div>
      {step === 1 && (
        <div className='justify-top mb-[80px] flex w-[380px] flex-col items-start rounded-tr-lg p-[32px] sm:mb-0 sm:w-[460px]'>
          <Image
            src='/assets/svg/tourStep1.svg'
            alt='step1'
            width={350}
            height={223}
            preview={false}
            className='mb-[24px] self-center'
          />
          <Image
            src='/assets/svg/tour-step-icon1.svg'
            alt='step-icon1'
            width={38}
            height={38}
            preview={false}
          />
          <div className='text-dark-normal my-[10px] text-[20px] leading-7'>
            Create and Deploy AeFinder AeIndexer
          </div>
          <div className='text-gray-80 text-[16px] leading-6'>
            Seamlessly build, customize, and deploy applications designed to
            index and manage blockchain data effortlessly.
          </div>
        </div>
      )}
      {step === 2 && (
        <div className='justify-top mb-[80px] flex w-[380px] flex-col items-start rounded-tr-lg p-[32px] sm:mb-0 sm:w-[460px]'>
          <Image
            src='/assets/svg/tourStep2.svg'
            alt='step2'
            width={350}
            height={223}
            preview={false}
            className='mb-[24px] self-center'
          />
          <Image
            src='/assets/svg/tour-step-icon2.svg'
            alt='step-icon2'
            width={38}
            height={38}
            preview={false}
          />
          <div className='text-dark-normal my-[10px] text-[20px] leading-7'>
            Index, Retrieve, and Manage Blockchain Data
          </div>
          <div className='text-gray-80 text-[16px] leading-6'>
            Utilize your deployed AeFinder AeIndexer to organize and access data
            on the aelf blockchain with ease.
          </div>
        </div>
      )}
      {step === 3 && (
        <div className='justify-top mb-[80px] flex w-[380px] flex-col items-start rounded-tr-lg p-[32px] sm:mb-0 sm:w-[460px]'>
          <Image
            src='/assets/svg/tourStep3.svg'
            alt='step3'
            width={350}
            height={223}
            preview={false}
            className='mb-[24px] self-center'
          />
          <Image
            src='/assets/svg/tour-step-icon3.svg'
            alt='step-icon3'
            width={38}
            height={38}
            preview={false}
          />
          <div className='text-dark-normal my-[10px] text-[20px] leading-7'>
            Explore Developer Tools
          </div>
          <div className='text-gray-80 text-[16px] leading-6'>
            Dive into our Playground for testing, and use Logs to monitor and
            optimize your applications.
          </div>
        </div>
      )}
    </div>
  );
}
