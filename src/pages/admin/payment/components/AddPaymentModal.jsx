import { FolderAddOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { Row } from 'antd';
import { NOTIFY_MESSAGE } from 'constants';
import React, { useRef } from 'react';
import { toast } from 'react-toastify';
import { createPayment } from 'services/payment';

const AddPaymentModal = ({ handleReload }) => {
  const formRef = useRef();

  return (
    <ModalForm
      title="Thêm phương thức thanh toán"
      width="50%"
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
      <ProFormText
        name="name"
        label="Phương thức thanh toán"
        rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
        className="p-4"
      />
    </ModalForm>
  );
};

export default AddPaymentModal;
