import { FolderAddOutlined } from '@ant-design/icons';
import { ModalForm, ProFormDatePicker, ProFormDigit, ProFormMoney, ProFormText } from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import { NOTIFY_MESSAGE } from 'constants';
import React, { useRef } from 'react';
import { toast } from 'react-toastify';
import { createVouchers } from 'services/vourcher';

const AddVoucherModal = ({ reloadTable }) => {
  const formRef = useRef();

  return (
    <ModalForm
      title="Thêm phiếu giảm giá"
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
          await createVouchers([
            {
              ...values
            }
          ]);
          toast.success(NOTIFY_MESSAGE.ADD_SUCCESS);
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

export default AddVoucherModal;
