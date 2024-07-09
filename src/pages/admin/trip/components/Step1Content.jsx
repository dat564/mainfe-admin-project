import { ProFormDateTimeRangePicker } from '@ant-design/pro-components';
import { Col } from 'antd';
import React from 'react';

const Step1Content = ({ setTimeRange }) => {
  return (
    <div className="mb-5">
      <Col span={12}>
        <ProFormDateTimeRangePicker
          name="timeRage"
          label="Thời gian xuất phát và kết thúc"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập trường này'
            }
          ]}
          fieldProps={{
            onChange: (value) => {
              setTimeRange(value);
            }
          }}
        />
      </Col>
    </div>
  );
};

export default Step1Content;
