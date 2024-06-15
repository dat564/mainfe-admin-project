import { ProFormSelect } from '@ant-design/pro-components';
import React from 'react';
import { getCarList } from 'services';

const Step1Content = ({ companyId }) => {
  const handleGetCarByTransportCompanyId = async () => {
    try {
      if (!companyId) return [];
      const res = await getCarList({ transport_company_id: companyId });
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
      <ProFormSelect
        name="carId"
        label="Xe"
        rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
        request={handleGetCarByTransportCompanyId}
        params={[companyId]}
      />
    </div>
  );
};

export default Step1Content;
