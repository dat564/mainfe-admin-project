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
import { createTrip } from 'services';
import { getUserList } from 'services';
import { getCityList } from 'services/cities';
import { getCompanyPaymentList } from 'services/companyPayment';

const AddTemplateTrip = () => {
  const formRef = useRef();
  const { transport_company } = useSelector((state) => state.auth.userInfo) || {};
  const [isStaticStartPoint, setIsStaticStartPoint] = React.useState(false);
  const [isStaticEndPoint, setIsStaticEndPoint] = React.useState(false);

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

  const handleGetCityList = async () => {
    try {
      const res = await getCityList();
      console.log({ res });
      const { results } = res?.data;
      return results.map((item) => ({ label: item.province_name, value: item.province_name }));
    } catch (error) {}
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
            scheduled_end_time: values.timeRage[1],
            is_template: true
          };
          await createTrip(obj);
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
            name="route_start"
            showSearch
            label="Tuyến xuất phát"
            request={handleGetCityList}
            rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
          />
        </Col>
        <Col span={12}>
          <ProFormSelect
            name="route_end"
            showSearch
            label="Tuyến đến"
            request={handleGetCityList}
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

        {/* <Col span={12}>
          <ProFormSelect
            name="start_point"
            showSearch
            label="Điểm xuất phát"
            request={handleGetCityList}
            rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
          />
        </Col>
        <Col span={12}>
          <ProFormSelect
            name="end_point"
            showSearch
            label="Điểm đến"
            request={handleGetCityList}
            rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
          />
        </Col> */}

        <Col span={12}>
          <ProFormSwitch
            name="static_start_point"
            label="Đón tận nơi"
            fieldProps={{
              onChange: (value) => {
                setIsStaticStartPoint(value);
              }
            }}
            style={{
              backgroundColor: 'red'
            }}
          />
        </Col>
        <Col span={12}>
          <ProFormSwitch
            name="static_end_point"
            label="Trả tận nơi"
            fieldProps={{
              onChange: (value) => {
                setIsStaticEndPoint(value);
              }
            }}
            style={{
              backgroundColor: 'red'
            }}
          />
        </Col>
        <Col span={12}>
          <ProFormText name="start_point" label="Điểm khởi hành" disabled={!isStaticStartPoint} />
        </Col>

        <Col span={12}>
          <ProFormText name="end_point" disabled={!isStaticEndPoint} label="Điểm kết thúc" />
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

export default AddTemplateTrip;
