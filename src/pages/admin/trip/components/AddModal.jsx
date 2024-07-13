import { StepsForm } from '@ant-design/pro-components';
import { Button, Modal, Spin } from 'antd';
import { NOTIFY_MESSAGE } from 'constants';
import Step1Content from './Step1Content';
import Step2Content from './Step2Content';
import React, { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { createTrip } from 'services/trip';
import { convertDatetimeToServer } from 'utils/date';
import Step3 from 'pages/admin/trip/components/Step3';

const AddModal = ({ handleReload, handleCancel, open }) => {
  const formRef = useRef();
  const stepFormRef = useRef();
  const [loading, setLoading] = useState(false);
  const [tripCreated, setTripCreated] = useState([]);
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
            setLoading(true);
            const bodyData = {
              ...values,
              departure_time: convertDatetimeToServer(timeRange[0]),
              scheduled_end_time: convertDatetimeToServer(timeRange[1]),
              transport_company_car_id: values.carId
            };

            delete bodyData.timeRage;

            const res = await createTrip([bodyData]);

            setTripCreated(res.data.data[0]);
            setLoading(false);
            handleReload && handleReload();
            toast.success(NOTIFY_MESSAGE.ADD_SUCCESS);
          }}
          submitter={{
            render: (props) => {
              if (current === 2) {
                return null;
              }
              return (
                <div className="flex justify-end gap-3">
                  {current > 0 && (
                    <Button
                      onClick={() => {
                        setCurrent((prev) => prev - 1);
                      }}
                    >
                      Trước
                    </Button>
                  )}
                  <Button
                    type="primary"
                    onClick={async () => {
                      if (current === 1) {
                        setLoading(() => true);
                        await formRef.current.submit();
                      }
                      if (!loading) setCurrent((prev) => prev + 1);
                    }}
                  >
                    Tiếp theo
                  </Button>
                </div>
              );
            }
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
          <StepsForm.StepForm name="step3" title={'Sửa vé'}>
            {loading ? <Spin spinning></Spin> : <Step3 trip={tripCreated} />}
          </StepsForm.StepForm>
        </StepsForm>
      </div>
    </Modal>
  );
};

export default AddModal;
