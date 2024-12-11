import Image from 'next/image';
import React from 'react';

export default function TransactionHistory() {
  // const [transactionHistoryList, setTransactionHistoryList] = useState([]);
  const transactionHistoryList = [];

  return (
    <div>
      {transactionHistoryList.length === 0 && (
        <div className='flex flex-col items-center justify-center'>
          <Image
            src='/assets/svg/transaction-history.svg'
            alt='history'
            width={220}
            height={186}
            className='mt-[170px]'
          />
          <div className='text-dark-normal mb-[14px] mt-[45px] text-2xl font-medium'>
            No billing transaction
          </div>
          <div className='text-gray-80'>
            As you add and remove USDT from the billing contract, a record of
            those transaction will show up here
          </div>
        </div>
      )}
    </div>
  );
}
