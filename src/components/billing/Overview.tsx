'use client';

import { Line } from '@ant-design/charts';
import { Col, Row, Slider, Statistic } from 'antd';
export default function Overview() {
  const data = [
    { year: '1991', value: 3 },
    { year: '1992', value: 4 },
    { year: '1993', value: 3.5 },
    { year: '1994', value: 5 },
    { year: '1995', value: 4.9 },
    { year: '1996', value: 6 },
    { year: '1997', value: 7 },
    { year: '1998', value: 9 },
    { year: '1999', value: 13 },
  ];
  const config = {
    data,
    title: {
      visible: true,
      text: 'wahaha',
    },
    xField: 'year',
    yField: 'value',
  };

  return (
    <div>
      <Row
        gutter={24}
        className='border-gray-E0 bg-gray-F5 my-[30px] rounded-lg border p-[24px]'
      >
        <Col span={6}>
          <Statistic
            title='Remaining Balance'
            value='$40.00 USDT'
            valueStyle={{ fontSize: '16px', fontWeight: 500 }}
          />
          <div className='text-gray-80 mt-[6px] text-sm'>($20.00 Locked)</div>
        </Col>
        <Col span={6}>
          <Statistic
            title='Daily Cost Average'
            value='$1.02 USDT'
            valueStyle={{ fontSize: '16px', fontWeight: 500 }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title='Monthly Cost Average'
            value='$32.80 USDT'
            valueStyle={{ fontSize: '16px', fontWeight: 500 }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title='Renews in'
            value='24 Days , 1 December 2024'
            valueStyle={{ fontSize: '16px', fontWeight: 500 }}
          />
        </Col>
      </Row>
      <Row gutter={24} className='gap-[14px]'>
        <Col span={8} className='border-gray-E0 rounded-lg border p-[24px]'>
          <div className='items-top flex justify-between'>
            <Statistic
              title='Queries made'
              value='0/200,000'
              valueStyle={{ fontSize: '16px', fontWeight: 500 }}
            />
            <div className='text-gray-80 relative top-[4px] text-xs'>
              Est. $0.4/daily
            </div>
          </div>
          <Slider
            defaultValue={5000}
            min={0}
            max={200000}
            step={100}
            disabled
          />
        </Col>
        <Col span={8} className='border-gray-E0 rounded-lg border p-[24px]'>
          <Statistic
            title='API Keys'
            value='0'
            valueStyle={{ fontSize: '16px', fontWeight: 500 }}
          />
          <div></div>
        </Col>
      </Row>
      <div>
        <div className='text-dark-normal mt-[32px]'>Current period queries</div>
        <Line {...config} />
      </div>
    </div>
  );
}
