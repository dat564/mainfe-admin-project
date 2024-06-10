import { FolderAddOutlined } from '@ant-design/icons';
import { ModalForm, ProFormDateTimeRangePicker, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import React, { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddTrip = ({ handleReload }) => {
  const formRef = useRef();
  const { feeId } = useParams();

  const fetchAllFee = async () => {
    try {
      // const res = await getAllFeeForField();
      // const data = res?.data;
      // return data.map((item) => ({ label: item.name, value: item.id }));
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <ModalForm
      title="Add batch fee"
      width="70%"
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
      initialValues={{
        feeId: Number(feeId)
      }}
      onFinish={async (values) => {
        try {
          const obj = {
            name: values.name,
            start_time: values.time[0],
            end_time: values.time[1],
            fee_id: values.feeId
          };

          // await createBatchFee(obj);
          handleReload();
          return true;
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
          <ProFormSelect name="feeId" label="Fee" request={fetchAllFee} disabled />
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

export default AddTrip;
