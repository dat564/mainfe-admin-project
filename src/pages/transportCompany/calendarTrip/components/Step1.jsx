import { ProFormDateRangePicker, ProFormSwitch, ProFormText } from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import React from 'react';

const Step1 = ({ data }) => {
  return (
    <Row gutter={[30, 20]} className="mb-5">
      <Col span={12}>
        <ProFormText
          name="name"
          showSearch
          initialValue={data?.name}
          label="Tên lịch trình"
          rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
        />
      </Col>
      <Col span={12}>
        <ProFormDateRangePicker
          name="dateRange"
          fieldProps={{
            initialValue: [data?.start_time, data?.end_time],
            format: 'DD/MM/YYYY'
          }}
          label="Ngày bắt đầu và kết thúc"
          rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
        />
      </Col>
      <Col span={12}>
        <ProFormSwitch name="is_active" label="Trạng thái" initialValue={data?.is_active} />
      </Col>
      <ProFormDateRangePicker hidden name="template_id" />
    </Row>
  );
};

export default Step1;
