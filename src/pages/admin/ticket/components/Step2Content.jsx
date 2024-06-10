import { DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import { Popconfirm } from 'antd';
import AddCarModal from 'pages/admin/car/components/AddCarModal';
import React, { useState } from 'react';

const Step2Content = ({ handleSetTickets }) => {
  const [dataSource, setDataSource] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: 50,
      render: (value, record, index) => index + 1
    },
    {
      title: 'Giá vé',
      dataIndex: 'price',
      key: 'price'
    },
    {
      title: 'Số ghế',
      dataIndex: 'position_on_car',
      key: 'position_on_car'
    },
    {
      title: 'Số chỗ ngồi',
      dataIndex: 'seating_capacity',
      key: 'seating_capacity'
    }
  ];

  const handleMultiDelete = () => {
    setDataSource(dataSource.filter((item) => !selectedRowKeys.includes(item.key)));
    setSelectedRowKeys([]);
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const handleCreateCar = (values) => {
    setDataSource([...dataSource, { ...values, key: dataSource.length + 1 }]);
    handleSetTickets([...dataSource, { ...values, key: dataSource.length + 1 }]);
    return true;
  };

  return (
    <div className="mb-5">
      <ProTable
        columns={columns}
        dataSource={dataSource}
        bordered
        search={false}
        rowSelection={{ selectedRowKeys, onChange: onSelectChange }}
        headerTitle={
          <div>
            <div className="flex items-center w-full gap-4">
              <AddCarModal handleCreateCar={handleCreateCar} />
              <Popconfirm
                title="Xóa"
                description="Bạn có chắc chấn muốn xóa?"
                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                onConfirm={handleMultiDelete}
                disabled={selectedRowKeys.length <= 0}
              >
                <span
                  className={`flex items-center justify-center p-3 transition-all bg-white border border-gray-200 rounded-md shadow-sm cursor-pointer hover:bg-gray-200 ${
                    selectedRowKeys.length <= 0 ? 'cursor-not-allowed' : ''
                  }`}
                >
                  <DeleteOutlined />
                </span>
              </Popconfirm>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default Step2Content;
