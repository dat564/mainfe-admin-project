import { ProFormSelect } from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import { TripModalContext } from 'pages/admin/trip/context';
import React, { useContext, useState } from 'react';
import { getCarList } from 'services';
import { getTransportCompany } from 'services';

const Step1Content = () => {
  const [transportCompany, setTransportCompany] = useState();
  const { valuesRef } = useContext(TripModalContext);

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
      if (!transportCompany) return [];
      const res = await getCarList({ transport_company_id: transportCompany });
      const data = res.data.data;
      return data.map((item) => ({
        label: `${item.name} - ${item.license_plate} - ${item.seat ?? 9} chỗ`,
        value: item.id
      }));
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="mb-5">
      <Row gutter={24}>
        <Col span={12}>
          <ProFormSelect
            name="transportCompanyId"
            label="Nhà xe"
            rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
            onChange={(value) => {
              setTransportCompany(value);
              valuesRef.current.transportCompanyId = value;
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
            params={[transportCompany]}
            disabled={!transportCompany}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Step1Content;
