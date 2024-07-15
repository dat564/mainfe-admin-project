import { FolderAddOutlined } from '@ant-design/icons';
import { ModalForm, ProFormMoney, ProFormSelect } from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import { NOTIFY_MESSAGE } from 'constants';
import React, { useRef } from 'react';
import { toast } from 'react-toastify';
import { createBreakpoint } from 'services/breakpoint';
import { getCityList } from 'services/cities';

const AddBreakPointModal = ({ trip, handleReload }) => {
  const formRef = useRef();

  const handleGetCityList = async () => {
    try {
      const res = await getCityList();
      const { results } = res?.data;
      return results.map((item) => ({ label: item.province_name, value: item.province_name }));
    } catch (error) {}
  };

  return (
    <ModalForm
      title="Thêm điểm dừng"
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
          const body = [
            {
              ...values,
              trip_id: trip.id
            }
          ];
          await createBreakpoint(body);
          handleReload && handleReload();
          toast.success(NOTIFY_MESSAGE.ADD_SUCCESS);
          return true;
        } catch (err) {}
      }}
      formRef={formRef}
      className="p-10"
    >
      <Row gutter={40}>
        <Col span={12}>
          <ProFormSelect
            name="name"
            showSearch
            label="Tuyến dừng"
            request={handleGetCityList}
            rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
          />
        </Col>
        <Col span={12}>
          <ProFormMoney name="price" label="Giá vé" rules={[{ required: true, message: 'Vui lòng nhập trường này' }]} />
        </Col>
      </Row>
    </ModalForm>
  );
};

export default AddBreakPointModal;
