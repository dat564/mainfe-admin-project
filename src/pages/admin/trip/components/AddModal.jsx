import { StepsForm } from '@ant-design/pro-components';
import { Modal } from 'antd';
import { NOTIFY_MESSAGE } from 'constants';
import Step1Content from './Step1Content';
import Step2Content from './Step2Content';
import React, { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { createTrip } from 'services/trip';
import { convertDatetimeToServer } from 'utils/date';
import moment from 'moment';
import { convertDatetimeOfDayjsToServer } from 'utils/date';

const AddModal = ({ handleReload, handleCancel, open }) => {
  const formRef = useRef();
  const stepFormRef = useRef();
  const [current, setCurrent] = useState(0);
  const [timeRange, setTimeRange] = useState([]);

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
              const bodyData = {
                ...values,
                departure_time: convertDatetimeToServer(timeRange[0]),
                scheduled_end_time: convertDatetimeToServer(timeRange[1]),
                transport_company_car_id: values.carId
              };

              delete bodyData.timeRage;

              await createTrip([bodyData]);

              toast.success(NOTIFY_MESSAGE.ADD_SUCCESS);
              handleReload();
              handleCancel();
              return true;
            } catch (err) {
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
          <StepsForm.StepForm name="step1" title="Chọn thời gian chạy">
            <Step1Content setTimeRange={setTimeRange} />
          </StepsForm.StepForm>
          <StepsForm.StepForm name="step2" title={'Thêm chuyến'}>
            <Step2Content timeRange={timeRange} />
          </StepsForm.StepForm>
        </StepsForm>
      </div>
    </Modal>
  );
};

export default AddModal;
