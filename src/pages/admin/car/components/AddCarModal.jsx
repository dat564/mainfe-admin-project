import { FolderAddOutlined } from '@ant-design/icons';
import { ModalForm, ProFormDigit, ProFormText } from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import React from 'react';

const AddCarModal = ({ handleCreateCar }) => {
  return (
    <ModalForm
      title="Thêm xe"
      width="60%"
      trigger={
        <span className="flex items-center justify-center p-3 transition-all bg-white border border-gray-200 rounded-md shadow-sm cursor-pointer hover:bg-gray-200">
          <FolderAddOutlined />
        </span>
      }
      modalProps={{
        onCancel: () => true,
        destroyOnClose: true
      }}
      onFinish={handleCreateCar}
    >
      <Row gutter={[30, 20]} className="mb-5">
        <Col span={12}>
          <ProFormText
            name="name"
            label="Tên xe"
            rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
            className="p-4"
          ></ProFormText>
        </Col>
        <Col span={12}>
          <ProFormDigit
            name="seating_capacity"
            label="Số chỗ ngồi"
            rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
          ></ProFormDigit>
        </Col>
        <Col span={12}>
          <ProFormText
            name="license_plate"
            label="Biển số xe"
            rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
          ></ProFormText>
        </Col>
        <Col span={12}>
          <ProFormText
            name="manufacture"
            rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
            label="Hãng sản xuất"
          ></ProFormText>
        </Col>
      </Row>
    </ModalForm>
  );
};

export default AddCarModal;
