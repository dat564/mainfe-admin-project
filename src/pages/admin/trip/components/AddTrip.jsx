import { FolderAddOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProFormDateTimeRangePicker,
  ProFormMoney,
  ProFormSelect,
  ProFormSwitch,
  ProFormText
} from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import { ROLES } from 'constants';
import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getCarList } from 'services';
import { getUserList } from 'services';
import { getCityList } from 'services/cities';
import { getCompanyPaymentList } from 'services/companyPayment';

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
        try {
          const obj = {
            ...values,
            departure_time: values.timeRage[0],
            scheduled_end_time: values.timeRage[1]
          };
          handleCreateTrip(obj);
          return true;
        } catch (err) {
          toast.error(err.response.data.message);
        }
      }}
      formRef={formRef}
      className="p-10"
    ></ModalForm>
  );
};

export default AddTrip;
