import { FolderAddOutlined } from '@ant-design/icons';
import { ModalForm } from '@ant-design/pro-components';
import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const AddTrip = ({ handleCreateTrip }) => {
  const formRef = useRef();
  const { transport_company } = useSelector((state) => state.auth.userInfo) || {};

  return (
    <ModalForm
      title="Thêm chuyến đi"
      width="60%"
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
        console.log({ values, departure_time: values.timeRage[0], scheduled_end_time: values.timeRage[1] });
        try {
          const obj = {
            ...values,
            departure_time: values.timeRage[0],
            scheduled_end_time: values.timeRage[1]
          };
          handleCreateTrip(obj);
          return true;
        } catch (err) {}
      }}
      formRef={formRef}
      className="p-10"
    ></ModalForm>
  );
};

export default AddTrip;
