import { DashboardOutlined } from '@ant-design/icons';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie, getElementAtEvent } from 'react-chartjs-2';
import React, { useRef } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import requireAuthentication from 'hoc/requireAuthentication';
import { ROLES } from 'constants';

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
    x: {
      stacked: true
    },
    y: {
      stacked: true
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

const DashBoard = () => {
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
              <h4 className="text-lg font-medium">Tài xế</h4>
              <div className="px-3 py-2 bg-[#624bff] bg-opacity-30 text-lg rounded text-[#624bff]">
                <DashboardOutlined />
              </div>
            </div>
            <span className="block mb-1 text-4xl font-bold">{cardData?.total_students}</span>
          </div>
          <div className="h-[170px] bg-white p-5 rounded text-black ">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium">Chuyến</h4>
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
              <h4 className="text-lg font-medium">Đơn hàng</h4>
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
              <h4 className="text-lg font-medium">Đánh giá</h4>
              <div className="px-3 py-2 bg-[#624bff] bg-opacity-30 text-lg rounded text-[#624bff]">
                <DashboardOutlined />
              </div>
            </div>
            <span className="block mb-1 text-4xl font-bold">{cardData?.total_major}</span>
          </div>
        </div>
      </div>
      <div className="flex gap-16 px-8">
        <Bar options={options} data={data} ref={chartRef} onClick={onClick} />
      </div>
    </div>
  );
};

export default requireAuthentication(DashBoard, [ROLES.ADMIN]);
