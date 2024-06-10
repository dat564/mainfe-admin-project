import { ModalForm, ProFormDateTimeRangePicker, ProFormText } from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import React, { useRef } from 'react';
import { toast } from 'react-toastify';

const EditTrip = ({ visible, handleReload, onClose, data }) => {
  const formRef = useRef();

  return (
    <ModalForm
      title="Edit batch fee"
      width="70%"
      open={visible}
      autoFocusFirstInput
      initialValues={{
        name: data?.name,
        time: [data?.start_time, data?.end_time],
        feeId: data.fee.name
      }}
      modalProps={{
        onCancel: () => onClose(),
        destroyOnClose: true
      }}
      onFinish={async (values) => {
        try {
          const obj = {
            ...data,
            name: values.name,
            start_time: values.time[0],
            end_time: values.time[1]
          };

          // await updateBatchFee(obj);
          handleReload();
          onClose();
        } catch (err) {
          toast.error(err.response.data.message);
        }
      }}
      formRef={formRef}
      className="p-10"
    >
      <Row gutter={24}>
        <Col span={12}>
          <ProFormText
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please select your name!' }]}
            className="p-4"
            placeholder="Please enter a name"
          ></ProFormText>
        </Col>
        <Col span={12}>
          <ProFormText name="feeId" label="Fee" className="p-4" disabled required />
        </Col>
        <Col span={12}>
          <ProFormDateTimeRangePicker
            name="time"
            label="Start time and End time"
            rules={[
              {
                required: true,
                message: 'Please select start time'
              }
            ]}
          ></ProFormDateTimeRangePicker>
        </Col>
      </Row>
    </ModalForm>
  );
};

export default EditTrip;
