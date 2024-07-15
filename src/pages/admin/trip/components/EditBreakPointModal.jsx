import { ModalForm, ProFormMoney, ProFormSelect } from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import { NOTIFY_MESSAGE } from 'constants';
import React, { useRef } from 'react';
import { toast } from 'react-toastify';
import { updateBreakpoint } from 'services/breakpoint';
import { getCityList } from 'services/cities';

const EditBreakPointModal = ({ trip, visible, handleReload, onClose, data }) => {
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
      title="Sửa điểm dừng"
      width="60%"
      open={visible}
      autoFocusFirstInput
      modalProps={{
        onCancel: onClose,
        destroyOnClose: true
      }}
      initialValues={data}
      onFinish={async (values) => {
        try {
          const body = [
            {
              ...values,
              trip_id: trip.id,
              id: data.id
            }
          ];
          await updateBreakpoint(body);
          handleReload && handleReload();

          onClose && onClose();
          toast.success(NOTIFY_MESSAGE.UPDATE_SUCCESS);
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
            label="Tuyến đến"
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

export default EditBreakPointModal;
