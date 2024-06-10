import { ProFormSelect } from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import React, { useState } from 'react';
import { getCarList } from 'services';
import { getTransportCompany } from 'services';
import { getTripList } from 'services/trip';

const Step1Content = () => {
  const [transportCompanyId, setTransportCompanyId] = useState();
  const [carId, setCarId] = useState();

  const handleGetTransportCompany = async () => {
    try {
      const res = await getTransportCompany();
      const data = res.data.data;
      return data.map((item) => ({
        label: item.name,
        value: item.id
      }));
    } catch (error) {
      throw error;
    }
  };

  const handleGetCarByTransportCompanyId = async () => {
    try {
      if (!transportCompanyId) return [];
      const res = await getCarList({ transport_company_id: transportCompanyId });
      const data = res.data.data;
      return data.map((item) => ({
        label: `${item.name} - ${item.license_plate} - ${item.seat ?? 9} chỗ`,
        value: item.id
      }));
    } catch (error) {
      throw error;
    }
  };

  const handleGetTripByCarId = async () => {
    try {
      if (!carId) return [];
      const res = await getTripList({ car_id: carId });
      const data = res.data.data;
      return data.map((item) => ({
        label: `${item.name}`,
        value: item.id
      }));
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="mb-5">
      <Row gutter={[30, 20]}>
        <Col span={12}>
          <ProFormSelect
            name="transportCompanyId"
            label="Nhà xe"
            rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
            onChange={(value) => {
              setTransportCompanyId(value);
            }}
            request={handleGetTransportCompany}
          />
        </Col>
        <Col span={12}>
          <ProFormSelect
            name="carId"
            label="Xe"
            rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
            request={handleGetCarByTransportCompanyId}
            params={[transportCompanyId]}
            onChange={(value) => {
              setCarId(value);
            }}
            disabled={!transportCompanyId}
          />
        </Col>
        <Col span={12}>
          <ProFormSelect
            name="tripId"
            rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
            label="Chuyến"
            request={handleGetTripByCarId}
            params={[carId]}
            disabled={!carId}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Step1Content;
