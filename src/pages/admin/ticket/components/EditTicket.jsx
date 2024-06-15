import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { NOTIFY_MESSAGE } from 'constants';
import React, { useRef } from 'react';
import { toast } from 'react-toastify';
import { updateTicket } from 'services';

const EditTicket = ({ handleReload, data, visible, onClose }) => {
  const formRef = useRef();

  return (
    <ModalForm
      title="Sửa vé"
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
          await updateTicket([
            {
              ...values,
              id: data.id
            }
          ]);
          toast.success(NOTIFY_MESSAGE.UPDATE_SUCCESS);
          onClose();
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

export default EditTicket;
