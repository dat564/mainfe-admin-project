import { ProFormSelect } from '@ant-design/pro-components';
import React from 'react';
import { getTransportCompany } from 'services';

const Step1Content = () => {
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

  return (
    <div className="mb-5">
      <ProFormSelect
        name="transport_company_id"
        label="Nhà xe"
        request={handleGetTransportCompany}
        rules={[{ required: true, message: 'Vui lòng chọn trường này' }]}
      />
    </div>
  );
};

export default Step1Content;
