import { ProFormMoney, ProFormSelect, ProFormSwitch, ProFormText } from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import { getCarList } from 'services';
import { getCityList } from 'services/cities';
import { getCompanyPaymentList } from 'services';
import { getUserList } from 'services';
import { ROLES } from 'constants';
import { convertDatetimeToServer } from 'utils/date';

const Step2Content = ({ timeRange }) => {
  console.log({ timeRange });
  const { transport_company } = useSelector((state) => state.auth.userInfo) || {};

  const handleGetDriver = async () => {
    try {
      const res = await getUserList({
        role: ROLES.DRIVER,
        departure_time: convertDatetimeToServer(timeRange[0].format('DD/MM/YYYY HH:mm:ss')),
        actual_end_time: convertDatetimeToServer(timeRange[1].format('DD/MM/YYYY HH:mm:ss'))
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

  const handleGetCarByTransportCompanyId = async () => {
    try {
      if (!transport_company) return [];
      const res = await getCarList({
        transport_company_id: transport_company?.id,
        start_time: convertDatetimeToServer(timeRange[0].format('DD/MM/YYYY HH:mm:ss')),
        end_time: convertDatetimeToServer(timeRange[1].format('DD/MM/YYYY HH:mm:ss'))
      });
      const data = res.data.data;
      return data.map((item) => ({
        label: `${item.name} - ${item.license_plate} - ${item.seating_capacity ? item.seating_capacity + ' chỗ' : ''}`,
        value: item.id
      }));
    } catch (error) {
      throw error;
    }
  };

  return (
    <Row gutter={[30, 20]} className="mb-10">
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
        <ProFormSelect
          name="carId"
          label="Xe"
          rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
          params={[timeRange, transport_company?.id]}
          request={handleGetCarByTransportCompanyId}
        />
      </Col>
      <Col span={12}>
        <ProFormSelect
          name="driver_id"
          label="Tài xế"
          request={handleGetDriver}
          params={[timeRange]}
          rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
        />
      </Col>

      <Col span={12}>
        <ProFormText
          name="start_point"
          label="Điểm khởi hành"
          rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
        />
      </Col>

      <Col span={12}>
        <ProFormText
          name="end_point"
          label="Điểm kết thúc"
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
      <Col span={12}>
        <ProFormSwitch name="is_template" label="Là mẫu" />
      </Col>
    </Row>
  );
};

export default Step2Content;
