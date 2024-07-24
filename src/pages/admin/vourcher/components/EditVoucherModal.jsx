import { ModalForm, ProFormDatePicker, ProFormDigit, ProFormMoney } from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import { NOTIFY_MESSAGE } from 'constants';
import React, { useRef } from 'react';
import { toast } from 'react-toastify';
import { updateVouchers } from 'services/vourcher';
import { convertDateToServer } from 'utils/date';

const EditVoucherModal = ({ show, data, onClose, reloadTable }) => {
  const formRef = useRef();

  return (
    <ModalForm
      title="Sửa phiếu giảm giá"
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
              id: data.id,
              expired_at: convertDateToServer(values.expired_at)
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
          <ProFormDigit
            name="regular_point_need"
            label="Điểm thưởng cần có"
            rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
            fieldProps={{
              formatter: (value) => {
                if (value === undefined || value === null) return '';
                return new Intl.NumberFormat('vi-VN').format(value);
              },
              parser: (value) => value.replace(/\./g, '') // Xóa bỏ dấu chấm khi phân tích ngược giá trị nhập
            }}
          />
        </Col>
        <Col span={12}>
          <ProFormDatePicker
            name="expired_at"
            label="Thời gian hết hạn"
            fieldProps={{
              format: 'DD/MM/YYYY'
            }}
            rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
          />
        </Col>
      </Row>
    </ModalForm>
  );
};

export default EditVoucherModal;
