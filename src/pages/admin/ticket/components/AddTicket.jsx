import { FolderAddOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProFormDateTimePicker,
  ProFormDigit,
  ProFormSelect,
  ProFormSwitch,
  ProFormText
} from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import { TICKET_STATUS_OPTIONS, NOTIFY_MESSAGE, ROLES } from 'constants';
import React, { useRef } from 'react';
import { toast } from 'react-toastify';
import { getUserList, getTripList } from 'services';
import { createPayment } from 'services/payment';
import { convertDatetimeToServer } from 'utils/date';

const AddTicket = ({ handleReload }) => {
  const formRef = useRef();

  const handleGetTrip = async () => {
    const { data } = await getTripList();
    return data.map((item) => ({
      label: item.name,
      value: item.id
    }));
  };

  const handleGetCustomer = async () => {
    const { data } = await getUserList({ role: ROLES.USER });
    return data.map((item) => ({
      label: item.name,
      value: item.id
    }));
  };

  return (
    <ModalForm
      title="Thêm vé"
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
          await createPayment([
            {
              ...values,
              purchase_time: convertDatetimeToServer(values.purchase_time)
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
      <Row gutter={[30, 20]} className="mb-5">
        <Col span={12}>
          <ProFormText
            name="name"
            label="Giá vé"
            rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
            className="p-4"
          />
        </Col>
        <Col span={12}>
          <ProFormDigit
            name="position_on_car"
            label="Số ghế"
            rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
          />
        </Col>
        <Col span={12}>
          <ProFormSelect
            name="status"
            label="Trạng thái"
            options={TICKET_STATUS_OPTIONS}
            rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
          />
        </Col>
        <Col span={12}>
          <ProFormDateTimePicker
            name="purchase_time"
            rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
            label="Thời gian mua"
            fieldProps={{
              format: 'DD/MM/YYYY HH:mm:ss'
            }}
          />
        </Col>
        <Col span={12}>
          <ProFormSelect
            name="trip_id"
            request={handleGetTrip}
            rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
            label="Chuyến"
          />
        </Col>
        <Col span={12}>
          <ProFormSelect
            name="customer_id"
            request={handleGetCustomer}
            rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
            label="Khách hàng"
          />
        </Col>
        <Col span={12}>
          <ProFormSwitch name="on_voucher" label="Áp dụng voucher" />
        </Col>
      </Row>
    </ModalForm>
  );
};

export default AddTicket;
