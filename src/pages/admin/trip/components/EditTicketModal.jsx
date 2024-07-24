import {
  ModalForm,
  ProFormDateTimePicker,
  ProFormDigit,
  ProFormSelect,
  ProFormSwitch,
  ProFormText
} from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import { TICKET_STATUS_OPTIONS } from 'constants';
import { NOTIFY_MESSAGE } from 'constants';
import React, { useRef } from 'react';
import { toast } from 'react-toastify';
import { getTripList } from 'services';
import { updateTicket } from 'services';
import { convertDatetimeToServer } from 'utils/date';

const EditTicketModal = ({ handleReload, data, visible, onClose }) => {
  const formRef = useRef();

  const handleGetTrip = async () => {
    const { data } = await getTripList();
    return data?.data?.map((item) => ({
      label: `${item?.route_start} ➡️ ${item?.route_end}`,
      value: item?.id
    }));
  };

  return (
    <ModalForm
      title="Sửa vé"
      width="70%"
      open={visible}
      initialValues={{
        ...data,
        position_on_car: Number(data?.position_on_car) + 1
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
              purchase_time: convertDatetimeToServer(values.purchase_time),
              position_on_car: values.position_on_car - 1
            }
          ]);
          toast.success(NOTIFY_MESSAGE.UPDATE_SUCCESS);
          onClose();
          handleReload();
          return true;
        } catch (err) {}
      }}
      formRef={formRef}
      className="px-10 py-5"
    >
      <Row gutter={[30, 20]} className="mb-5">
        <Col span={12}>
          <ProFormDigit name="position_on_car" label="Số ghế" disabled />
        </Col>
        <Col span={12}>
          <ProFormSelect
            name="status"
            label="Trạng thái"
            disabled
            options={TICKET_STATUS_OPTIONS}
            rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
          />
        </Col>

        <Col span={12}>
          <ProFormSelect disabled name="trip_id" request={handleGetTrip} label="Chuyến" />
        </Col>

        <Col span={12}>
          <ProFormDigit
            name="regular_point"
            label="Điểm thưởng"
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

export default EditTicketModal;
