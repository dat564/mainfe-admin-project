import { ModalForm, ProFormDatePicker, ProFormDigit, ProFormMoney, ProFormText } from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import { NOTIFY_MESSAGE } from 'constants';
import React, { useRef } from 'react';
import { toast } from 'react-toastify';
import { updateBill, createBill } from 'services/bill';

const AddOrEditBillModal = ({ reloadTable, data, open, handleCancel }) => {
  const formRef = useRef();

  return (
    <ModalForm
      title={data ? 'Sửa đơn' : 'Thêm đơn'}
      width="70%"
      open={open}
      initialValues={data}
      autoFocusFirstInput
      modalProps={{
        onCancel: handleCancel,
        destroyOnClose: true
      }}
      onFinish={async (values) => {
        try {
          if (data) {
            await updateBill([
              {
                ...values
              }
            ]);
            toast.success(NOTIFY_MESSAGE.UPDATE_SUCCESS);
          } else {
            await createBill([
              {
                ...values
              }
            ]);
            toast.success(NOTIFY_MESSAGE.ADD_SUCCESS);
          }
          handleCancel();
          reloadTable();
          return true;
        } catch (err) {
          return false;
        }
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

export default AddOrEditBillModal;
