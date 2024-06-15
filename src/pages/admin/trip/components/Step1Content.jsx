import { ProFormSelect } from '@ant-design/pro-components';
import React from 'react';
import { useSelector } from 'react-redux';
import { getCarList } from 'services';

const Step1Content = () => {
  const { transport_company } = useSelector((state) => state.auth.userInfo) || {};

  console.log({ transport_company });

  const handleGetCarByTransportCompanyId = async () => {
    try {
      if (!transport_company) return [];
      const res = await getCarList({ transport_company_id: transport_company?.id });
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
    <div className="mb-5">
      <ProFormSelect
        name="carId"
        label="Xe"
        rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
        request={handleGetCarByTransportCompanyId}
        params={[transport_company?.id]}
      />
    </div>
  );
};

export default Step1Content;
