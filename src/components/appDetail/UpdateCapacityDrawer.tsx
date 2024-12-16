import type { CollapseProps } from 'antd';
import { Button, Col, Collapse, Divider, Drawer, Row } from 'antd';
import { MessageInstance } from 'antd/es/message/interface';
import { useCallback, useState } from 'react';

import { useAppSelector } from '@/store/hooks';

type DeployDrawerProps = {
  readonly isShowUpdateCapacityModal: boolean;
  readonly setIsShowUpdateCapacityModal: (visible: boolean) => void;
  readonly messageApi: MessageInstance;
};

export default function UpdateCapacityDrawer({
  isShowUpdateCapacityModal,
  setIsShowUpdateCapacityModal,
  messageApi,
}: DeployDrawerProps) {
  const [isShowCapacityCollapse, setIsShowCapacityCollapse] = useState(false);
  const [currentCapacityType, setCurrentCapacityType] = useState('small');
  const { currentAppDetail } = useAppSelector((state) => state.app);
  console.log(currentAppDetail);
  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: `${isShowCapacityCollapse ? 'Hide' : 'Show'} capacity details`,
      children: (
        <div>
          <Row gutter={24}>
            <Col span={6} className='text-gray-80 text-xs'>
              Size
            </Col>
            <Col span={6} className='text-gray-80 text-xs'>
              CPU
            </Col>
            <Col span={6} className='text-gray-80 text-xs'>
              RAM
            </Col>
            <Col span={6} className='text-gray-80 text-xs'>
              Disk
            </Col>
          </Row>
          <Divider className='my-[8px]' />
          <Row gutter={24}>
            <Col span={6} className='text-gray-80 text-sm'>
              Small
            </Col>
            <Col span={6} className='text-gray-80 text-sm'>
              0.5
            </Col>
            <Col span={6} className='text-gray-80 text-sm'>
              768 MB
            </Col>
            <Col span={6} className='text-gray-80 text-sm'>
              10 GB
            </Col>
          </Row>
        </div>
      ),
    },
  ];

  const onChange: CollapseProps['onChange'] = (key) => {
    console.log(key);
    setIsShowCapacityCollapse((pre) => !pre);
  };

  const handleClose = useCallback(() => {
    setIsShowUpdateCapacityModal(false);
  }, [setIsShowUpdateCapacityModal]);

  const handleSave = useCallback(() => {
    messageApi.open({
      type: 'success',
      content: 'Successfully updated capacity',
    });
    handleClose();
  }, [messageApi, handleClose]);

  return (
    <Drawer
      title='Update Capacity'
      placement='right'
      onClose={handleClose}
      open={isShowUpdateCapacityModal}
    >
      <Collapse items={items} onChange={onChange} />
      <div className='text-dark-normal mb-[10px] mt-[24px]'>
        AeIndexer Capacity:
      </div>
      <div className='flex items-center justify-between'>
        <Button
          type={currentCapacityType === 'small' ? 'primary' : 'default'}
          className='w-[30%]'
          size='large'
          onClick={() => setCurrentCapacityType('small')}
        >
          Small
        </Button>
        <Button
          type={currentCapacityType === 'medium' ? 'primary' : 'default'}
          className='w-[30%]'
          size='large'
          onClick={() => setCurrentCapacityType('medium')}
        >
          Medium
        </Button>
        <Button
          type={currentCapacityType === 'large' ? 'primary' : 'default'}
          className='w-[30%]'
          size='large'
          onClick={() => setCurrentCapacityType('large')}
        >
          Large
        </Button>
      </div>
      <div className='text-blue-link my-[24px] cursor-pointer text-sm'>
        Learn more about full pod and query pod.
      </div>
      <div className='bg-gray-F5 rounded-lg p-[20px]'>
        <div className='mb-[20px] flex items-center justify-between'>
          <span className='text-gray-80 text-sm'>Capacity Cost*</span>
          <span className='text-dark-normal'>$32.80/month</span>
        </div>
        <div className='flex items-center justify-between'>
          <span className='text-gray-80 text-sm'>First Month Cost*</span>
          <span className='text-dark-normal'>$22.80</span>
        </div>
        <Divider className='my-[20px]' />
        <div className='flex items-center justify-between'>
          <span className='text-gray-80 text-sm'>Current Balance</span>
          <span className='text-dark-normal'>$32.80</span>
        </div>
        <Divider className='my-[20px]' />
        <div className='flex items-center justify-between'>
          <span className='text-dark-normal'>Required deposit</span>
          <span className='text-dark-normal'>$0.00</span>
        </div>
      </div>
      <div className='text-gray-80 mt-[24px] text-sm'>
        *This amount will remain locked in your Billing Balance and be charged
        at the end of the month.
      </div>
      <Divider className='my-[24px]' />
      <Button
        type='primary'
        className='w-full'
        size='large'
        onClick={handleSave}
      >
        Save
      </Button>
    </Drawer>
  );
}
