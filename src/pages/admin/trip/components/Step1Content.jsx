import { ProFormDateTimeRangePicker } from '@ant-design/pro-components';
import { Col } from 'antd';
import moment from 'moment';
import React from 'react';

const validateTimeRange = (_, value) => {
  if (!value || !value[0] || !value[1]) {
    return Promise.reject(new Error('Vui lòng nhập trường này'));
  }
  const [start, end] = value;
  if (start.isBefore(moment().startOf('day'))) {
    return Promise.reject(new Error('Ngày bắt đầu phải từ ngày hiện tại trở đi'));
  }
  return Promise.resolve();
};

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
              validator: validateTimeRange
            }
          ]}
          fieldProps={{
            onChange: (value) => {
              setTimeRange(value);
            }
          }}
          disabledDate={(current) => current && current < moment().startOf('day')}
        />
      </Col>
    </div>
  );
};

export default Step1Content;
