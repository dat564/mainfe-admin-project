import { ModalForm, ProFormDatePicker, ProFormDigit, ProFormMoney, ProFormText } from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import { NOTIFY_MESSAGE } from 'constants';
import React, { useRef } from 'react';
import { toast } from 'react-toastify';
import { updateVouchers } from 'services/vourcher';

const EditVoucherModal = ({ show, data, onClose, reloadTable }) => {
  const formRef = useRef();

  return (
    <ModalForm
      title="Sửa nhà xe"
      width="70%"
      open={show}
      initialValues={data}
      autoFocusFirstInput
      modalProps={{
        onCancel: () => onClose(),
        destroyOnClose: true
      }}
      onFinish={async (values) => {
        try {
          await updateVouchers([
            {
              ...values,
              id: data.id
            }
          ]);
          onClose();
          toast.success(NOTIFY_MESSAGE.UPDATE_SUCCESS);
          reloadTable();
          return true;
        } catch (err) {}
      }}
      formRef={formRef}
      className="px-10 py-5"
    >
      <Row gutter={[30, 20]}>
        <Col span={12}>
          <ProFormDigit
            name="quantity"
            label="Số lượng"
            rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
            className="p-4"
          ></ProFormDigit>
        </Col>
        <Col span={12}>
          <ProFormMoney
            name="discount_price"
            label="Số tiền giảm giá"
            rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
          />
        </Col>
        <Col span={12}>
          <ProFormText
            name="regular_point_need"
            label="Điểm thưởng cần có"
            rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
          ></ProFormText>
        </Col>
        <Col span={12}>
          <ProFormDatePicker
            name="expired_at"
            label="Thời gian hết hạn"
            rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
          />
        </Col>
      </Row>
    </ModalForm>
  );
};

export default EditVoucherModal;
