import { FolderAddOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProFormDateTimeRangePicker,
  ProFormMoney,
  ProFormSelect,
  ProFormSwitch
} from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import { NOTIFY_MESSAGE } from 'constants';
import { CITIES } from 'constants';
import { ROLES } from 'constants';
import React, { useRef } from 'react';
import { toast } from 'react-toastify';
import { updateTrip } from 'services';
import { getUserList } from 'services';
import { getCompanyPaymentList } from 'services/companyPayment';

const EditTrip = ({ handleUpdateTrip, handleReload, data, visible, onClose, isTempUpdate = false }) => {
  const formRef = useRef();

  const handleGetDriver = async () => {
    try {
      const res = await getUserList({
        role: ROLES.DRIVER
      });
      const { data } = res?.data;
      return data.map((item) => ({ label: item.name, value: item?.driver?.id }));
    } catch (error) {
      console.log({ error });
    }
  };

  const handleGetCompanyPaymentList = async () => {
    try {
      const res = await getCompanyPaymentList({
        // transport_company_id: valuesRef.current?.transportCompanyId
      });
      const { data } = res?.data;
      return data.map((item) => ({ label: item.name_bank, value: item.id }));
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <ModalForm
      title="Sửa chuyến đi"
      width="60%"
      open={visible}
      autoFocusFirstInput
      modalProps={{
        onCancel: () => onClose(),
        destroyOnClose: true
      }}
      initialValues={{
        ...data,
        timeRage: [data.departure_time, data.scheduled_end_time]
      }}
      onFinish={async (values) => {
        try {
          if (!isTempUpdate) {
            const body = {
              ...values,
              id: data.id
            };
            await updateTrip(body);
            handleReload();
            toast.success(NOTIFY_MESSAGE.UPDATE_SUCCESS);
            return true;
          } else {
            const obj = {
              ...values,
              departure_time: values.timeRage[0],
              scheduled_end_time: values.timeRage[1]
            };
            handleUpdateTrip(obj);
            return true;
          }
        } catch (err) {}
      }}
      formRef={formRef}
      className="p-10"
    >
      <Row gutter={[30, 20]}>
        <Col span={12}>
          <ProFormSelect
            name="start_point"
            showSearch
            label="Điểm xuất phát"
            options={CITIES}
            rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
          />
        </Col>
        <Col span={12}>
          <ProFormSelect
            name="end_point"
            showSearch
            label="Điểm đến"
            options={CITIES}
            rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
          />
        </Col>
        <Col span={12}>
          <ProFormDateTimeRangePicker
            name="timeRage"
            label="Thời gian xuất phát và kết thúc"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập trường này'
              }
            ]}
          ></ProFormDateTimeRangePicker>
        </Col>
        <Col span={12}>
          <ProFormSelect
            name="driver_id"
            label="Tài xế"
            request={handleGetDriver}
            rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
          />
        </Col>
        <Col span={12}>
          <ProFormSelect
            name="route_start"
            showSearch
            label="Tuyến xuất phát"
            options={CITIES}
            rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
          />
        </Col>
        <Col span={12}>
          <ProFormSelect
            name="route_end"
            showSearch
            label="Tuyến đến"
            options={CITIES}
            rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
          />
        </Col>
        <Col span={12}>
          <ProFormSwitch
            name="static_start_point"
            label="Điểm đón tĩnh"
            style={{
              backgroundColor: 'red'
            }}
          />
        </Col>
        <Col span={12}>
          <ProFormSwitch
            name="static_end_point"
            label="Điểm đến tĩnh"
            style={{
              backgroundColor: 'red'
            }}
          />
        </Col>
        {isTempUpdate && (
          <Col span={12}>
            <ProFormSelect
              name="transport_company_payment_id"
              showSearch
              request={handleGetCompanyPaymentList}
              label="Phương thức thanh toán"
              rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
            />
          </Col>
        )}
        <Col span={12}>
          <ProFormMoney
            name="price_static"
            label="Giá mặc định"
            // rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
          />
        </Col>
      </Row>
    </ModalForm>
  );
};

export default EditTrip;
