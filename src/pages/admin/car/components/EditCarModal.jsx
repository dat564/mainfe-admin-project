import { ModalForm, ProFormDigit, ProFormText } from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import { NOTIFY_MESSAGE } from 'constants';
import React, { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { updateCar } from 'services';
import { createCar } from 'services';

const EditCarModal = ({ companyId, handleReload, visible, onClose, data }) => {
  const formRef = useRef();

  useEffect(() => {
    if (!data && !formRef.current) return;
    formRef.current.setFieldsValue({
      ...data
    });
  }, [data]);

  return (
    <ModalForm
      formRef={formRef}
      title="Sửa xe"
      width="60%"
      open={visible}
      modalProps={{
        onCancel: () => onClose(),
        destroyOnClose: true
      }}
      onFinish={async (values) => {
        try {
          await updateCar([{ ...values, id: data.id }]);
          handleReload();
          onClose();
          toast.success(NOTIFY_MESSAGE.UPDATE_SUCCESS);
          return true;
        } catch (error) {
          return false;
        }
      }}
    >
      <Row gutter={[30, 20]} className="p-5">
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

export default EditCarModal;
