import { FolderAddOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProFormDatePicker,
  ProFormDateTimePicker,
  ProFormDigit,
  ProFormSelect,
  ProFormText
} from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import { NOTIFY_MESSAGE } from 'constants';
import React, { useRef } from 'react';
import { toast } from 'react-toastify';
import { createPayment } from 'services/payment';

const AddTicket = ({ handleReload }) => {
  const formRef = useRef();

  return (
    <ModalForm
      title="Thêm vé"
      width="70%"
      trigger={
        <span className="flex items-center justify-center p-3 transition-all bg-white border border-gray-200 rounded-md shadow-sm cursor-pointer hover:bg-gray-200">
          <FolderAddOutlined />
        </span>
      }
      autoFocusFirstInput
      modalProps={{
        onCancel: () => true,
        destroyOnClose: true
      }}
      onFinish={async (values) => {
        try {
          await createPayment([
            {
              ...values
            }
          ]);
          toast.success(NOTIFY_MESSAGE.ADD_SUCCESS);
          handleReload();
          return true;
        } catch (err) {
          toast.error(err.response.data.message);
        }
      }}
      formRef={formRef}
      className="px-10 py-5"
    >
      <Row gutter={[30, 20]} className="mb-5">
        <Col span={12}>
          <ProFormText
            name="name"
            label="Giá vé"
            rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
            className="p-4"
          />
        </Col>
        <Col span={12}>
          <ProFormDigit
            name="seating_capacity"
            label="Số ghế"
            rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
          />
        </Col>
        <Col span={12}>
          <ProFormSelect
            name="license_plate"
            label="Trạng thái"
            options={[
              {
                label: 'Đang hoạt động',
                value: 'active'
              },
              {
                label: 'Không hoạt động',
                value: 'inactive'
              }
            ]}
            rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
          />
        </Col>
        <Col span={12}>
          <ProFormDateTimePicker
            name="manufacture"
            rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
            label="Thời gian mua"
          />
        </Col>
        <Col span={12}>
          <ProFormSelect
            name="manufacture"
            rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
            label="Chuyến"
          />
        </Col>
        <Col span={12}>
          <ProFormSelect
            name="manufacture"
            rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
            label="Khách hàng"
          />
        </Col>
      </Row>
    </ModalForm>
  );
};

export default AddTicket;
