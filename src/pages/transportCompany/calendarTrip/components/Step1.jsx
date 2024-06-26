import { ProFormDateRangePicker, ProFormText } from '@ant-design/pro-components';
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
          initialValue={[data?.start_time, data?.end_time]}
          label="Ngày bắt đầu và kết thúc"
          rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
        />
      </Col>
      <ProFormDateRangePicker hidden name="template_id" />
    </Row>
  );
};

export default Step1;
