import React, { useRef, useState } from 'react';
import { DeleteOutlined, FolderAddOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { formatTime } from 'utils/utils';
import { Popconfirm } from 'antd';
import { toast } from 'react-toastify';
import EditTrip from './components/EditTrip';
import requireAuthentication from 'hoc/requireAuthentication';
import { ROLES } from 'constants';
import AddModal from './components/AddModal';
import { getTripList } from 'services/trip';
import { useSelector } from 'react-redux';
import Tabular from 'components/Tabular';
import { multiDeleteTrip } from 'services';
import { NOTIFY_MESSAGE } from 'constants';
import { renderFormCol } from 'utils';

const TripPage = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedInstance, setSelectedInstance] = useState(null);
  const [loading, setLoading] = useState(false);
  const { transport_company } = useSelector((state) => state.auth.userInfo) || {};
  console.log({ transport_company });

  const tableRef = useRef();

  const { selectedRowKeys, setSelectedRowKeys } = tableRef.current || {};

  async function handleDelete(recordId) {
    try {
      setLoading(true);
      await multiDeleteTrip({ ids: [recordId] });
      setSelectedRowKeys([]);
      toast.success(NOTIFY_MESSAGE.DELETE_SUCCESS);
      handleReload();
    } catch (error) {
      toast.error(error.response.data.message);
    }
    setLoading(false);
  }

  const columns = [
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
      key: 'start_point',
      renderFormItem: renderFormCol
    },
    {
      title: 'Điểm đến',
      dataIndex: 'end_point',
      key: 'end_point',
      renderFormItem: renderFormCol
    },

    {
      title: 'Nhà xe',
      dataIndex: 'transport_company_car_id',
      key: 'transport_company_car_id',
      renderFormItem: renderFormCol
    },
    {
      title: 'Tài xế',
      dataIndex: 'driver_id',
      key: 'driver_id',
      renderFormItem: renderFormCol
    }
  ];

  const handleReload = () => {
    tableRef.current.reload();
  };

  const handleMultiDelete = async () => {
    try {
      handleReload();
      toast.success('Delete successfully!');
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="min-h-[100vh] px-5 mt-10">
      <Tabular
        ref={tableRef}
        loading={loading}
        columns={columns}
        rowKey={(e) => e.id}
        request={async (params) => {
          setLoading(true);
          const _params = {
            ...params,
            transport_company_id: transport_company?.id,
            per_size: params.pageSize,
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
        options={{
          reload: () => {
            setLoading(true);
            tableRef.current.reset();
            setTimeout(() => {
              setLoading(false);
            }, 1000);
          }
        }}
        headerTitle={
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-medium ">Quản lý chuyến</h1>
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
              disabled={selectedRowKeys?.length <= 0}
            >
              <span
                className={`flex items-center justify-center p-3 transition-all bg-white border border-gray-200 rounded-md shadow-sm cursor-pointer hover:bg-gray-200 ${
                  selectedRowKeys?.length <= 0 ? 'cursor-not-allowed' : ''
                }`}
              >
                <DeleteOutlined />
              </span>
            </Popconfirm>
          </div>
        }
        handleDelete={handleDelete}
        handleEdit={(record) => {
          setShowEditModal(true);
          setSelectedInstance(record);
        }}
      />
      {showEditModal && (
        <EditTrip
          handleReload={handleReload}
          visible={showEditModal}
          onClose={() => setShowEditModal(false)}
          data={selectedInstance}
        />
      )}
      {showAddModal && (
        <AddModal
          handleReload={handleReload}
          open={showAddModal}
          handleCancel={() => setShowAddModal(false)}
          companyId={transport_company?.id}
        />
      )}
    </div>
  );
};

export default requireAuthentication(TripPage, [ROLES.ADMIN]);
