import { DashboardOutlined } from '@ant-design/icons';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie, getElementAtEvent } from 'react-chartjs-2';
import React, { useRef } from 'react';
import { useEffect } from 'react';
import { getDataChart } from 'services';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import requireAuthentication from 'hoc/requireAuthentication';
import { ROLES } from 'constants';
// import { getDashboardCard } from "services/fee";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top'
    },
    title: {
      display: true,
      text: 'Tuition payment rate by class'
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      suggestedMax: 100,
      ticks: {
        stepSize: 10 // Bước giữa các giá trị trên trục y
      }
    }
  }
};

export const pieChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top'
    },
    title: {
      display: true,
      text: 'Tuition payment rate among classes'
    }
  }
};

const DashBoardTransportCompany = () => {
  const [labels, setLabels] = useState();
  const [dataSets, setDataSets] = useState([]);
  const [idsClass, setIdsClass] = useState([]);
  const [dataSetsPieChart, setDataSetsPieChart] = useState([]);
  const [cardData, setCardData] = useState();
  const navigate = useNavigate();
  const chartRef = useRef();

  const dynamicColors = dataSetsPieChart.map(
    () =>
      `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(
        Math.random() * 256
      )}, 0.2)`
  );

  const onClick = (event) => {
    const ele = getElementAtEvent(chartRef.current, event);
    if (!ele.length) return;
    const search = {
      status_fee: '0',
      class_id: idsClass[ele[0].index]
    };
    navigate('/tuition', {
      state: {
        defaultSearch: search
      }
    });
  };

  const data = {
    labels,
    datasets: [
      {
        label: 'Tuition payment rate',
        data: dataSets,
        backgroundColor: 'rgba(255, 99, 132, 0.5)'
      }
    ]
  };

  const dataPieChart = {
    labels,
    datasets: [
      {
        label: 'Tuition payment rate',
        data: dataSets,
        backgroundColor: dynamicColors,
        borderColor: dynamicColors.map((color) => color.replace('0.2', '1')), // Tạo đường viền cho màu sắc tương ứng,
        borderWidth: 1
      }
    ]
  };

  // useEffect(() => {
  //   getDashboardCard()
  //     .then((res) => {
  //       console.log({ res });
  //       setCardData(res.data);
  //     })
  //     .catch((err) => console.log(err));
  //   getDataChart()
  //     .then((res) => {
  //       const data = res.data;
  //       setLabels(data.map((item) => item.class_name));
  //       setIdsClass(data.map((item) => item.class_id));
  //       setDataSets(data.map((item) => item.fee_completion_percentage));
  //       setDataSetsPieChart(() => {
  //         const sum = data.reduce(
  //           (result, cur) => result + cur.fee_completion_percentage,
  //           0
  //         );
  //         const res = data.map(
  //           (item) => (item.fee_completion_percentage / sum) * 100
  //         );
  //         return res;
  //       });
  //     })
  //     .catch((err) => console.log(err));
  // }, []);

  return (
    <div className="w-full min-h-[100vh]">
      <div className="bg-[#624BFF] h-52 px-8 pt-[62px] text-white mb-24">
        <h3 className="text-2xl font-medium mb-7">Dashboard</h3>
        <div className="grid grid-cols-4 gap-6">
          <div
            className="h-[170px] bg-white p-5 rounded text-black cursor-pointer"
            onClick={() => {
              navigate('/students');
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium">Students</h4>
              <div className="px-3 py-2 bg-[#624bff] bg-opacity-30 text-lg rounded text-[#624bff]">
                <DashboardOutlined />
              </div>
            </div>
            <span className="block mb-1 text-4xl font-bold">{cardData?.total_students}</span>
            <span className="text-[#637381] flex items-center gap-3">
              <span
                className="p-2 text-sm font-medium text-white bg-red-500 rounded cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/tuition', {
                    state: {
                      defaultSearch: {
                        status_fee: '0'
                      }
                    }
                  });
                }}
              >
                Debt: {cardData?.students_debt_fees}
              </span>
              <span
                className="p-2 text-sm font-medium text-white bg-green-500 rounded cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/tuition', {
                    state: {
                      defaultSearch: {
                        status_fee: '1'
                      }
                    }
                  });
                }}
              >
                Sufficient: {cardData?.students_sufficient_fees}
              </span>
            </span>
          </div>
          <div className="h-[170px] bg-white p-5 rounded text-black ">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium">Classes</h4>
              <div className="px-3 py-2 bg-[#624bff] bg-opacity-30 text-lg rounded text-[#624bff]">
                <DashboardOutlined />
              </div>
            </div>
            <span className="block mt-5 text-4xl font-bold">{cardData?.total_classes}</span>
          </div>
          <div
            className="h-[170px] bg-white p-5 rounded text-black cursor-pointer"
            onClick={() => {
              navigate('/fee');
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium">Fees</h4>
              <div className="px-3 py-2 bg-[#624bff] bg-opacity-30 text-lg rounded text-[#624bff]">
                <DashboardOutlined />
              </div>
            </div>
            <span className="block mb-1 text-4xl font-bold">{cardData?.total_fees}</span>
          </div>
          <div
            className="h-[170px] bg-white p-5 rounded text-black cursor-pointer"
            onClick={() => {
              navigate('/majors');
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium">Majors</h4>
              <div className="px-3 py-2 bg-[#624bff] bg-opacity-30 text-lg rounded text-[#624bff]">
                <DashboardOutlined />
              </div>
            </div>
            <span className="block mb-1 text-4xl font-bold">{cardData?.total_major}</span>
          </div>
        </div>
      </div>
      <div className="flex gap-16 px-8">
        <div className="w-[1000px] chart bg-white p-10">
          <Bar options={options} data={data} ref={chartRef} onClick={onClick} />
        </div>
        <div className="w-[500px] bg-white p-10">
          <Pie data={dataPieChart} options={pieChartOptions} />
        </div>
      </div>
    </div>
  );
};

export default requireAuthentication(DashBoardTransportCompany, [ROLES.ADMIN]);
