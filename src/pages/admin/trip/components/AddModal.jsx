import { StepsForm } from '@ant-design/pro-components';
import { Modal } from 'antd';
import { NOTIFY_MESSAGE } from 'constants';
import Step1Content from './Step1Content';
import Step2Content from './Step2Content';
import React, { useCallback, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { createTrip } from 'services/trip';

const AddModal = ({ handleReload, handleCancel, open }) => {
  const formRef = useRef();
  const stepFormRef = useRef();
  const [current, setCurrent] = useState(0);
  const [trips, setTrips] = useState([]);

  const handleSetTrips = useCallback((dataSource) => {
    setTrips(dataSource);
  }, []);

  return (
    <Modal
      title={'Thêm chuyến'}
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
              const bodyData = trips.map((trip) => ({
                ...values,
                ...trip,
                transport_company_car_id: values.carId
              }));

              await createTrip(bodyData);

              toast.success(NOTIFY_MESSAGE.ADD_SUCCESS);
              handleReload();
              handleCancel();
              return true;
            } catch (err) {
              toast.error(err.response.data.message);
              return false;
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
          <StepsForm.StepForm name="step1" title="Chọn xe">
            <Step1Content />
          </StepsForm.StepForm>
          <StepsForm.StepForm name="step2" title={'Thêm chuyến'}>
            <Step2Content handleSetTrips={handleSetTrips} />
          </StepsForm.StepForm>
        </StepsForm>
      </div>
    </Modal>
  );
};

export default AddModal;
