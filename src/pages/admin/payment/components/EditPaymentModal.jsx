import { FolderAddOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { Row } from 'antd';
import { NOTIFY_MESSAGE } from 'constants';
import React, { useRef } from 'react';
import { toast } from 'react-toastify';
import { updatePayment } from 'services/payment';
import { createPayment } from 'services/payment';

const EditPaymentModal = ({ handleReload, data, visible, onClose }) => {
  const formRef = useRef();

  return (
    <ModalForm
      title="Sửa phương thức thanh toán"
      width="70%"
      open={visible}
      initialValues={{
        name: data?.name
      }}
      autoFocusFirstInput
      modalProps={{
        onCancel: () => onClose(),
        destroyOnClose: true
      }}
      onFinish={async (values) => {
        try {
          await updatePayment([
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
      <Row gutter={[30, 20]}>
        <ProFormText
          name="name"
          label="Phương thức thanh toán"
          rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
          className="p-4"
        />
      </Row>
    </ModalForm>
  );
};

export default EditPaymentModal;
