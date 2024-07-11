import {
  ModalForm,
  ProFormDateTimePicker,
  ProFormDigit,
  ProFormSelect,
  ProFormSwitch,
  ProFormText
} from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import { ROLES } from 'constants';
import { TICKET_STATUS_OPTIONS } from 'constants';
import { NOTIFY_MESSAGE } from 'constants';
import React, { useRef } from 'react';
import { toast } from 'react-toastify';
import { getUserList } from 'services';
import { getTripList } from 'services';
import { updateTicket } from 'services';
import { convertDatetimeToServer } from 'utils/date';

const EditTicket = ({ handleReload, data, visible, onClose }) => {
  const formRef = useRef();

  console.log({ data });

  const handleGetTrip = async () => {
    const { data } = await getTripList();
    return data?.data?.map((item) => ({
      label: `${item?.route_start} ➡️ ${item?.route_end}`,
      value: item?.id
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
      title="Sửa vé"
      width="70%"
      open={visible}
      initialValues={{
        ...data
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
              id: data.id,
              purchase_time: convertDatetimeToServer(values.purchase_time)
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
      <Row gutter={[30, 20]} className="mb-5">
        <Col span={12}>
          <ProFormText
            name="price"
            label="Giá vé"
            rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
            className="p-4"
          />
        </Col>
        <Col span={12}>
          <ProFormDigit name="position_on_car" label="Số ghế" disabled />
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
          <ProFormSelect disabled name="trip_id" request={handleGetTrip} label="Chuyến" />
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
          <ProFormSwitch
            name="on_voucher"
            label="Áp dụng voucher"
            style={{
              backgroundColor: 'red'
            }}
          />
        </Col>
      </Row>
    </ModalForm>
  );
};

export default EditTicket;
