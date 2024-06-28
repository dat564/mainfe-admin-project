import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';

const StepsForm = forwardRef(({ onFinish, steps }, ref) => {
  const [current, setCurrent] = useState(0);
  const formRef = useRef();

  useImperativeHandle(ref, () => ({
    form: formRef.current,
    current
  }));

  return (
    <StepsForm
      formRef={formRef}
      current={current}
      autoFocusFirstInput
      onFinish={onFinish}
      onCurrentChange={(current) => {
        setCurrent(current);
      }}
      containerStyle={{
        margin: 0,
        width: '100%'
      }}
    >
      {steps.map((step) => (
        <StepsForm.StepForm name={step.name} title={step.title}>
          {step.content}
        </StepsForm.StepForm>
      ))}
    </StepsForm>
  );
});

export default StepsForm;
