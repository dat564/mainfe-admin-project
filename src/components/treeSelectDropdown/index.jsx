import React, { useReducer, useState } from 'react';
import styles from './index.module.css';

const steps = [
  {
    title: 'Thành phố',
    content: 'First-content',
    key: 'city',
    data: []
  },
  {
    title: 'Quận huyện',
    content: 'Second-content',
    key: 'district',
    data: []
  },
  {
    title: 'Phường xã',
    content: 'Last-content',
    data:[],
    key: 'ward'
  }
];

const initialState = steps.reduce(
  (acc, step) => {
    acc[step.key] = {
      selected: null,
      data: []
    };
    return acc;
  },
  {
    result: []
  }
);

const reducer = (state, action) => {
  switch (action.type) {
    case 'SELECT':
      return {
        ...state,
        [action.step]: {
          ...state[action.step],
          selected: action.selected
        }
      };
    case 'SET_DATA':
      return {
        ...state,
        [action.step]: {
          ...state[action.step],
          data: action.data
        }
      };
    default:
      return state;
  }
};

const TreeSelectDropDown = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div className="w-[400px] h-[400px] gap-2 border mt-[200px] flex flex-col p-5">
      <div className="w-full h-[40px] border p-3">
        <span>{state.result?.join(', ')}</span>
      </div>
      <div className="flex-1 border">
        <div className="flex items-center">
          {steps.map((step, index) => (
            <div
              key={step.key}
              className={`flex-1 relative h-[40px] flex items-center justify-center cursor-pointer ${styles.step}`}
              onClick={() => setCurrentStep(index)}
            >
              {step.title}
              {index === currentStep ? (
                <div className={`absolute bottom-0 w-full h-1 bg-blue-400 ${styles.active}`}></div>
              ) : null}
            </div>
          ))}
        </div>
        <div className="h-[250px] p-3 flex flex-col gap-1 overflow-auto border">
          {steps[currentStep].data.map((item) => (
            <div
              key={item.value}
              className={`h-[40px] border rounded-md p-5 flex items-center transition-all justify-between ${
                state[steps[currentStep].key].selected === item.value
                  ? 'text-blue-400'
                  : 'hover:bg-gray-200 cursor-pointer'
              }`}
              onClick={() => dispatch({ type: 'SELECT', step: steps[currentStep].key, selected: item.value })}
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TreeSelectDropDown;
