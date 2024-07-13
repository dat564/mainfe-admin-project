import { StepsForm } from '@ant-design/pro-components';
import { Modal } from 'antd';
import { NOTIFY_MESSAGE } from 'constants';
import React, { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import Step1 from './Step1';
import Step2 from './Step2';
import { createCalendarTrip } from 'services';
import { useSelector } from 'react-redux';
import { updateCalendarTrip } from 'services';
import { convertDateToServer } from 'utils/date';

const StepsFormModal = ({ handleReload, handleCancel, open, data }) => {
  const formRef = useRef();
  const stepFormRef = useRef();
  const [current, setCurrent] = useState(0);
  const [templateId, setTemplateId] = useState(data?.template_id);
  const { transport_company } = useSelector((state) => state.auth.userInfo);

  return (
    <Modal
      title={data ? 'Sửa lịch trình' : 'Thêm lịch trình'}
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
          initialValues={data}
          autoFocusFirstInput
          onFinish={async (values) => {
            if (!templateId) {
              toast.error('Vui lòng chọn mẫu lịch trình!');
              return false;
            }
            try {
              const bodyData = {
                ...values,
                template_id: templateId,
                start_time: convertDateToServer(values.dateRange[0]),
                end_time: convertDateToServer(values.dateRange[1]),
                transport_company_id: transport_company.id
              };

              if (data) {
                bodyData.id = data.id;
                await updateCalendarTrip([bodyData]);
                toast.success(NOTIFY_MESSAGE.UPDATE_SUCCESS);
              } else {
                await createCalendarTrip([bodyData]);
                toast.success(NOTIFY_MESSAGE.ADD_SUCCESS);
              }
              handleReload();
              handleCancel();
            } catch (err) {
              // toast.error(err.response.data.message);
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
            <Step1 data={data} />
          </StepsForm.StepForm>
          <StepsForm.StepForm name="step2" title={'Chọn mẫu'}>
            <Step2 setTemplateId={setTemplateId} form={formRef.current} data={data} />
          </StepsForm.StepForm>
        </StepsForm>
      </div>
    </Modal>
  );
};

export default StepsFormModal;
