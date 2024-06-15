import { FolderAddOutlined } from '@ant-design/icons';
import { ModalForm, ProFormDatePicker, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import { NOTIFY_MESSAGE } from 'constants';
import React, { useRef } from 'react';
import { toast } from 'react-toastify';
import { createCalendarTrip } from 'services';
import { getTemplateCalendarTripList } from 'services/templateCalendarTrip';

const Step1 = ({ handleReload }) => {
  const formRef = useRef();

  const handleGetTemplateList = async () => {
    try {
      const res = await getTemplateCalendarTripList();
      console.log({ res: res.data.data });
      return res.data.data.map((item) => ({
        label: item?.name,
        value: item?.id
      }));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <Row gutter={[30, 20]} className="mb-5">
      <Col span={12}>
        <ProFormText
          name="name"
          showSearch
          label="Tên lịch trình"
          rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
        />
      </Col>
      <Col span={12}>
        <ProFormDatePicker
          name="start_time"
          label="Ngày bắt đầu"
          rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
        />
      </Col>
      <Col span={12}>
        <ProFormDatePicker
          name="end_time"
          label="Ngày kết thúc"
          rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
        />
      </Col>
    </Row>
  );
};

export default Step1;
