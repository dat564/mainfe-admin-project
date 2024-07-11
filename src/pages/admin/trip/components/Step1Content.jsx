import { ProFormDateTimeRangePicker } from '@ant-design/pro-components';
import { Col } from 'antd';
import dayjs from 'dayjs';
import moment from 'moment';
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
            },
            // validate chỉ cho phép chọn thời gian trong tương lai
            {
              message: 'Thời gian xuất phát phải sau thời gian hiện tại',
              validator: (_, value) => {
                if (value && value[0].isBefore(moment())) {
                  return Promise.reject('Thời gian xuất phát phải sau thời gian hiện tại');
                }
                return Promise.resolve();
              }
            }
          ]}
          fieldProps={{
            onChange: (value) => {
              setTimeRange([
                dayjs(value[0]).format('DD/MM/YYYY HH:mm:ss'),
                dayjs(value[1]).format('DD/MM/YYYY HH:mm:ss')
              ]);
            },
            format: 'DD/MM/YYYY HH:mm:ss',
            disabledDate: (current) => current && current < moment().startOf('day').add(1, 'day')
          }}
        />
      </Col>
    </div>
  );
};

export default Step1Content;
