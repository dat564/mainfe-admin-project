import { StepsForm } from '@ant-design/pro-components';
import { Modal } from 'antd';
import { NOTIFY_MESSAGE } from 'constants';
import Step1Content from './Step1Content';
import Step2Content from './Step2Content';
import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { createTrip } from 'services/trip';
import { TripModalContext } from 'pages/admin/trip/context';

const AddModal = ({ handleReload, handleCancel, open }) => {
  const formRef = useRef();
  const stepFormRef = useRef();
  const [current, setCurrent] = useState(0);
  const [trips, setTrips] = useState([]);
  const valuesRef = useRef({});

  const handleSetTrips = useCallback((dataSource) => {
    setTrips(dataSource);
  }, []);

  const contextValues = useMemo(() => ({ valuesRef }), []);

  // useLayoutEffect(() => {
  //   if (stepFormRef.current) {
  //     const btns = stepFormRef.current.querySelectorAll('.ant-btn');
  //     if (btns.length === 0) return; // Check if btns is empty

  //     const parent = btns[0]?.parentNode?.parentNode;
  //     if (parent) {
  //       parent.classList.add('flex', 'w-full', 'justify-end');
  //     }

  //     btns.forEach((btn, index) => {
  //       if (current === 0) {
  //         btn.innerHTML = 'Tiếp theo';
  //       } else if (current === 1) {
  //         if (index === 0) {
  //           btn.innerHTML = 'Quay lại';
  //         } else {
  //           btn.innerHTML = 'Hoàn thành';
  //         }
  //       }
  //     });
  //   }
  // }, [current]);

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
      <TripModalContext.Provider value={contextValues}>
        <div ref={stepFormRef} className="px-5">
          <StepsForm
            formRef={formRef}
            current={current}
            autoFocusFirstInput
            onFinish={async (values) => {
              try {
                console.log({ values });
                const bodyData = trips.map((trip) => ({
                  ...values,
                  ...trip,
                  transport_company_car_id: values.carId
                }));

                await createTrip(bodyData);

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
            <StepsForm.StepForm name="step1" title="Chọn xe">
              <Step1Content />
            </StepsForm.StepForm>
            <StepsForm.StepForm name="step2" title={'Thêm chuyến'}>
              <Step2Content handleSetTrips={handleSetTrips} />
            </StepsForm.StepForm>
          </StepsForm>
        </div>
      </TripModalContext.Provider>
    </Modal>
  );
};

export default AddModal;
