import { StepsForm } from '@ant-design/pro-components';
import { Button, Modal, Spin } from 'antd';
import { NOTIFY_MESSAGE } from 'constants';
import Step1Content from './Step1Content';
import Step2Content from './Step2Content';
import React, { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { createTrip } from 'services/trip';
import { convertDatetimeToServer } from 'utils/date';
import Step4 from 'pages/admin/trip/components/Step4';
import Step3 from 'pages/admin/trip/components/Step3';

const AddModal = ({ handleReload, handleCancel, open }) => {
  const formRef = useRef();
  const [loading, setLoading] = useState(false);
  const [tripCreated, setTripCreated] = useState();
  const [current, setCurrent] = useState(0);
  const [timeRange, setTimeRange] = useState([]);

  const handleCreateTrip = async () => {
    try {
      const values = await formRef.current.validateFields();
      setLoading(true);

      const bodyData = {
        ...values,
        departure_time: convertDatetimeToServer(timeRange[0]),
        scheduled_end_time: convertDatetimeToServer(timeRange[1]),
        transport_company_car_id: values.carId,
        static_start_point: values.staticStartPoint || false,
        static_end_point: values.staticEndPoint || false
      };

      delete bodyData.timeRange;

      const res = await createTrip([bodyData]);

      setTripCreated(res.data.data[0]);
      if (handleReload) handleReload();
      setCurrent((prev) => prev + 1);
      toast.success(NOTIFY_MESSAGE.ADD_SUCCESS);
    } catch (error) {
      toast.error('Vui lòng điền đầy đủ thông tin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Thêm chuyến"
      width="70%"
      submitter={false}
      open={open}
      onCancel={handleCancel}
      footer={null}
      className="add-modal"
    >
      <div className="px-5">
        <StepsForm
          formRef={formRef}
          current={current}
          autoFocusFirstInput
          submitter={{
            render: (props) => {
              if (current === 3) {
                return null;
              }
              return (
                <div className="flex justify-end gap-3">
                  {current > 0 && current !== 2 && (
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
                        handleCreateTrip();
                      } else {
                        if (!timeRange.length) {
                          toast.error('Vui lòng chọn thời gian chạy');
                          return;
                        }
                        setCurrent((prev) => prev + 1);
                      }
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
          <StepsForm.StepForm name="step2" title="Thêm chuyến">
            <Spin spinning={loading}>
              <Step2Content timeRange={timeRange} />
            </Spin>
          </StepsForm.StepForm>
          <StepsForm.StepForm name="step3" title="Thêm điểm dừng">
            {tripCreated && <Step3 trip={tripCreated} />}
          </StepsForm.StepForm>
          <StepsForm.StepForm name="step4" title="Sửa vé">
            {tripCreated && <Step4 trip={tripCreated} />}
          </StepsForm.StepForm>
        </StepsForm>
      </div>
    </Modal>
  );
};

export default AddModal;
