import {
  ProFormDatePicker,
  ProFormDigit,
  ProFormFieldSet,
  ProFormGroup,
  ProFormList,
  ProFormMoney,
  ProFormSelect,
  ProFormSwitch,
  ProFormText
} from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import React from 'react';
import { getCarList } from 'services';
import { getCityList } from 'services/cities';
import { getUserList } from 'services';
import { ROLES } from 'constants';
import { convertDatetimeToServer } from 'utils/date';

const Step2Content = ({ timeRange }) => {
  console.log({ timeRange });
  const [isStaticStartPoint, setIsStaticStartPoint] = React.useState(false);
  const [isStaticEndPoint, setIsStaticEndPoint] = React.useState(false);

  const handleGetDriver = async () => {
    try {
      const res = await getUserList({
        role: ROLES.DRIVER,
        departure_time: convertDatetimeToServer(timeRange[0]),
        actual_end_time: convertDatetimeToServer(timeRange[1])
      });
      const { data } = res?.data;
      return data.map((item) => ({ label: item.name, value: item?.driver?.id }));
    } catch (error) {
      console.log({ error });
    }
  };

  const handleGetCityList = async () => {
    try {
      const res = await getCityList();
      const { results } = res?.data;
      return results.map((item) => ({ label: item.province_name, value: item.province_name }));
    } catch (error) {}
  };

  const handleGetCarByTransportCompanyId = async () => {
    try {
      const res = await getCarList({
        start_time: convertDatetimeToServer(timeRange[0]),
        end_time: convertDatetimeToServer(timeRange[1])
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
          params={[timeRange]}
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
        <ProFormSwitch
          name="static_start_point"
          label="Đón cố định"
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
          label="Trả cố định"
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
        <ProFormMoney
          name="price_static"
          label="Giá mặc định"
          rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
        />
      </Col>

      {/* <Col span={24}>
        <ProFormList
          name="users"
          label="Các điểm dừng"
          rules={[
            {
              validator: async (_, value) => {
                console.log(value);
                if (value && value.length > 0) {
                  return;
                }
                throw new Error('至少要有一项！');
              }
            }
          ]}
        >
          <ProFormGroup>
            <ProFormSelect
              name="break_point"
              showSearch
              label="Điểm dừng"
              request={handleGetCityList}
              width={550}
              rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
            />
            <ProFormMoney name="price" label="Giá" width={550} />
          </ProFormGroup>
        </ProFormList>
      </Col> */}
    </Row>
  );
};

export default Step2Content;
