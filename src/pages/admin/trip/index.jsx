import { ProTable } from '@ant-design/pro-components';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DeleteOutlined, FolderAddOutlined, QuestionCircleOutlined, SettingOutlined } from '@ant-design/icons';
import { formatTime } from 'utils/utils';
import { Dropdown, Modal, Popconfirm } from 'antd';
import { toast } from 'react-toastify';
import EditTrip from './components/EditTrip';
import requireAuthentication from 'hoc/requireAuthentication';
import { ROLES } from 'constants';
import Setting from 'components/svgs/Setting';
import AddModal from './components/AddModal';
import { getTripList } from 'services/trip';

// , static_end_point

const TripPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);

  const tableRef = useRef();

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  async function handleDelete(recordId) {
    try {
      setLoading(true);
      // await deleteBatchFee({ ids: [recordId] });
      toast.success('Delete successfully!');
      handleReload();
    } catch (error) {
      toast.error(error.response.data.message);
    }
    setLoading(false);
  }

  const items = [
    {
      key: '1',
      label: 'Delete'
    },
    {
      label: 'Edit',
      key: '2'
    }
  ];

  const columns = [
    {
      title: (
        <div className="flex items-center justify-center">
          <Setting />
        </div>
      ),
      dataIndex: 'settings',
      width: 100,
      hideInSearch: true,
      key: 'settings',
      search: false,
      align: 'center',
      render: (text, record) => (
        <div className="flex items-center justify-center">
          <Dropdown
            menu={{
              items,
              onClick: async (e) => {
                switch (e.key) {
                  case '1':
                    Modal.confirm({
                      title: 'Bạn có chắc chắn muốn xóa?',
                      okText: 'Đồng ý',
                      cancelText: 'Hủy',
                      onOk: () => {
                        handleDelete(record.id);
                      }
                    });
                    break;
                  case '2':
                    setShowEditModal(true);
                    setSelectedRow(record);
                    break;
                  default:
                }
              }
            }}
            trigger={['click']}
          >
            <div className="flex items-center justify-center w-10 h-10 font-medium transition-all bg-white border border-blue-500 rounded-md cursor-pointer hover:bg-blue-500 hover:text-white">
              <SettingOutlined />
            </div>
          </Dropdown>
        </div>
      )
    },
    {
      title: 'Thời gian khởi hành',
      dataIndex: 'departure_time',
      hideInSearch: true,
      key: 'departure_time',
      render: (_, record) => formatTime(record.scheduled_end_time)
    },
    {
      title: 'Thời gian kết thúc',
      dataIndex: 'scheduled_end_time',
      key: 'scheduled_end_time',
      render: (_, record) => formatTime(record.scheduled_end_time),
      hideInSearch: true
    },
    {
      title: 'Điểm xuất phát',
      dataIndex: 'start_point',
      key: 'start_point'
    },
    {
      title: 'Điểm đến',
      dataIndex: 'end_point',
      key: 'end_point'
    },
    // {
    //   title: 'Trạng thái',
    //   dataIndex: 'status',
    //   key: 'status',
    //   valueEnum: {
    //     0: { text: 'Chưa khởi hành', status: 'Processing' },
    //     1: { text: 'Đang chạy', status: 'Success' },
    //     2: { text: 'Đã kết thúc', status: 'Error' }
    //   }
    // },
    {
      title: 'Nhà xe',
      dataIndex: 'transport_company_car_id',
      key: 'transport_company_car_id'
    },
    {
      title: 'Tài xế',
      dataIndex: 'driver_id',
      key: 'driver_id'
    }
  ];

  const handleReload = () => {
    tableRef.current.reload();
  };

  const handleMultiDelete = async () => {
    try {
      // await deleteBatchFee({ ids: selectedRowKeys });
      handleReload();
      toast.success('Delete successfully!');
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="min-h-[100vh] px-5 mt-10">
      <ProTable
        actionRef={tableRef}
        columns={columns}
        rowKey={(e) => e.id}
        onRow={(record) => {
          return {
            onClick: () => {
              navigate(`${record.id}`);
            }
          };
        }}
        request={async (params) => {
          setLoading(true);
          const _params = {
            ...params,
            per_side: params.pageSize,
            page: params.current,
            start_time: params?.dateRange && params.dateRange[0],
            end_time: params?.dateRange && params.dateRange[1]
          };

          const res = await getTripList(_params);
          setLoading(false);
          return {
            data: res.data.data,
            success: true,
            total: res.data.total
          };
        }}
        rowClassName="cursor-pointer"
        headerTitle={
          <div>
            <h1 className="mt-10 mb-2 text-xl font-medium">Quản lý chuyến</h1>
            <div className="flex items-center w-full gap-4">
              <span
                className="flex items-center justify-center p-3 transition-all bg-white border border-gray-200 rounded-md shadow-sm cursor-pointer hover:bg-gray-200"
                onClick={() => setShowAddModal(true)}
              >
                <FolderAddOutlined />
              </span>
              <Popconfirm
                title="Xóa"
                description="Bạn có chắc muốn xóa?"
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
        rowSelection={{ selectedRowKeys, onChange: onSelectChange }}
        pagination={{
          pageSize: 10
        }}
        search={{
          labelWidth: 'auto'
        }}
        loading={loading}
        options={{
          reload: () => {
            setLoading(true);
            tableRef.current.reset();
            setTimeout(() => {
              setLoading(false);
            }, 1000);
          }
        }}
      />
      {showEditModal && (
        <EditTrip
          handleReload={handleDelete}
          visible={showEditModal}
          onClose={() => setShowEditModal(false)}
          data={selectedRow}
        />
      )}
      {showAddModal && (
        <AddModal handleReload={handleReload} open={showAddModal} handleCancel={() => setShowAddModal(false)} />
      )}
    </div>
  );
};

export default requireAuthentication(TripPage, [ROLES.ADMIN]);
