import { StepsForm } from '@ant-design/pro-components';
import { Modal } from 'antd';
import { NOTIFY_MESSAGE } from 'constants';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { createTrip } from 'services/trip';
import Step1 from './Step1';
import Step2 from './Step2';

const StepsFormModal = ({ handleReload, handleCancel, open }) => {
  const formRef = useRef();
  const stepFormRef = useRef();
  const [current, setCurrent] = useState(0);
  const [trips, setTrips] = useState([]);

  return (
    <Modal
      title={'Thêm lịch trình'}
      width="70%"
      submitter={false}
      open={open}
      onCancel={handleCancel}
      footer={null}
      className="add-modal"
    >
      <div ref={stepFormRef} className="px-5">
        <StepsForm
          formRef={formRef}
          current={current}
          autoFocusFirstInput
          onFinish={async (values) => {
            try {
              // const bodyData = trips.map((trip) => ({
              //   ...values,
              //   ...trip,
              //   transport_company_car_id: values.carId
              // }));

              // await createTrip(bodyData);

              toast.success(NOTIFY_MESSAGE.ADD_SUCCESS);
              handleReload();
              handleCancel();
            } catch (err) {
              toast.error(err.response.data.message);
            }
          }}
          onCurrentChange={(current) => {
            setCurrent(current);
          }}
          containerStyle={{
            margin: 0,
            width: '100%'
          }}
        >
          <StepsForm.StepForm name="step1" title="Tạo lịch trình">
            <Step1 />
          </StepsForm.StepForm>
          <StepsForm.StepForm name="step2" title={'Chọn mẫu'}>
            <Step2 />
          </StepsForm.StepForm>
        </StepsForm>
      </div>
    </Modal>
  );
};

export default StepsFormModal;
