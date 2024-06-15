import { FolderAddOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProFormDateTimeRangePicker,
  ProFormMoney,
  ProFormSelect,
  ProFormSwitch
} from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import { CITIES } from 'constants';
import { ROLES } from 'constants';
import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getUserList } from 'services';
import { getCompanyPaymentList } from 'services/companyPayment';

const AddTrip = ({ handleCreateTrip }) => {
  const formRef = useRef();
  const { transport_company } = useSelector((state) => state.auth.userInfo) || {};

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
        transport_company_id: transport_company?.id
      });
      const { data } = res?.data;
      return data.map((item) => ({ label: item.name_bank, value: item.id }));
    } catch (error) {
      console.log({ error });
    }
  };

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
        <Col span={12}>
          <ProFormSelect
            name="transport_company_payment_id"
            showSearch
            request={handleGetCompanyPaymentList}
            label="Phương thức thanh toán"
            rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
          />
        </Col>
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

export default AddTrip;
