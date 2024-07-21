import { DashboardOutlined } from '@ant-design/icons';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import requireAuthentication from 'hoc/requireAuthentication';
import { ROLES } from 'constants';
import { getTripProfit } from 'services';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const DashBoardTransportCompany = () => {
  const [labels, setLabels] = useState();
  const [dataSets, setDataSets] = useState([]);
  const [cardData, setCardData] = useState();
  const navigate = useNavigate();
  const chartRef = useRef();

  const data = {
    labels,
    datasets: [
      {
        label: 'Tổng tiền',
        data: dataSets,
        backgroundColor: 'rgba(255, 99, 132, 0.5)'
      },
      {
        label: 'Tổng tiền thu được',
        data: dataSets,
        backgroundColor: 'rgba(54, 162, 235, 0.5)'
      },
      {
        label: 'Số tiền thua lỗ',
        data: dataSets,
        backgroundColor: 'rgba(255, 206, 86, 0.5)'
      }
    ]
  };

  const config = {
    type: 'bar',
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top'
        },
        title: {
          display: true,
          text: 'Chart.js Bar Chart'
        }
      }
    }
  };

  useEffect(() => {
    getTripProfit({ period: 'week' }).then((res) => {
      const labels = Object.keys(res.data);
      const dataSets = labels.reduce(
        (acc, cur) => {
          const current = res.data[cur];

          acc['total_max_profit'].push(current.total_max_profit);
          acc['total_actual_profit'].push(current.total_actual_profit);
          acc['total_loss'].push(-Number(current.total_loss));

          return acc;
        },
        {
          total_max_profit: [],
          total_actual_profit: [],
          total_loss: []
        }
      );
      setLabels(labels);
      setDataSets(dataSets);
    });
  }, []);

  return (
    <div className="w-full min-h-[100vh] overflow-auto">
      <div className="bg-[#624BFF] h-52 px-8 pt-[62px] text-white mb-24">
        <h3 className="text-2xl font-medium mb-7">Dashboard</h3>
        <div className="grid grid-cols-4 gap-6">
          <div
            className="h-[170px] bg-white p-5 rounded text-black cursor-pointer"
            onClick={() => {
              navigate('/drivers');
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
              navigate('/bill');
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
              navigate('/rating');
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
        <Bar
          options={config}
          data={{
            labels,
            datasets: [
              {
                label: 'Tổng tiền',
                data: dataSets['total_max_profit'],
                backgroundColor: 'rgba(255, 99, 132, 0.5)'
              },
              {
                label: 'Tổng tiền thu được',
                data: dataSets['total_actual_profit'],
                backgroundColor: 'rgba(54, 162, 235, 0.5)'
              },
              {
                label: 'Số tiền thua lỗ',
                data: dataSets['total_loss'],
                backgroundColor: 'rgba(255, 206, 86, 0.5)'
              }
            ]
          }}
          ref={chartRef}
          // onClick={onClick}
        />
      </div>
    </div>
  );
};

export default requireAuthentication(DashBoardTransportCompany, [ROLES.TRANSPORT_COMPANY]);
