import { DashboardOutlined } from '@ant-design/icons';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import requireAuthentication from 'hoc/requireAuthentication';
import { ROLES } from 'constants';
import { getTripProfit } from 'services';
import { useSelector } from 'react-redux';
import { Button, Col, Row } from 'antd';
import { ProForm, ProFormDatePicker, ProFormDateRangePicker } from '@ant-design/pro-components';
import { convertDateToServer } from 'utils/date';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [labels, setLabels] = useState();
  const [dataSets, setDataSets] = useState([]);
  const [cardData, setCardData] = useState();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.auth.userInfo);
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

  const handleGetTripProfit = (params) => {
    getTripProfit(params).then((res) => {
      const labels = res.data.map((item) => item.company_name);
      const dataSets = labels.reduce(
        (acc, cur) => {
          const current = res.data.find((item) => item.company_name === cur);

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
      setDataSets(dataSets);
      setLabels(labels);
    });
  };

  const handleSearch = (values) => {
    const { date_range } = values;
    if (!date_range) return;
    const params = {
      period: 'custom',
      start_date: convertDateToServer(date_range[0]),
      end_date: convertDateToServer(date_range[1])
    };
    handleGetTripProfit(params);
  };

  useEffect(() => {
    handleGetTripProfit(userInfo.role === ROLES.TRANSPORT_COMPANY ? { period: 'week' } : {});
  }, [userInfo.role]);

  return (
    <div className="flex-1 min-h-[100vh] overflow-auto">
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
      <div className="ml-5">
        <ProForm submitter={false} className="flex items-end gap-5" onFinish={handleSearch}>
          <ProFormDateRangePicker
            name="date_range"
            label="Khoảng thời gian"
            fieldProps={{
              format: 'DD/MM/YYYY'
            }}
            width={'md'}
          />
          <Button type="primary" htmlType="submit" key="submit">
            Lọc
          </Button>
        </ProForm>
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

export default requireAuthentication(Dashboard, [ROLES.ADMIN]);
