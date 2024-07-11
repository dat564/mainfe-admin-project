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
import Setting from 'components/svgs/Setting';
import { operatorColumnRender } from 'utils/columns';
import { getDriverList } from 'services';
import { convertDateAndFormat } from 'utils/date';

const TripPage = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedInstance, setSelectedInstance] = useState(null);
  const [loading, setLoading] = useState(false);
  const { transport_company } = useSelector((state) => state.auth.userInfo) || {};
  const tableRef = useRef();

  const { getSelectedRowKeys, setSelectedRowKeys } = tableRef.current || {};

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

  function handleEdit(record) {
    setSelectedInstance(record);
    setShowEditModal(true);
  }

  const handleGetDriverList = async () => {
    try {
      const res = await getDriverList({
        transport_company_id: transport_company?.id
      });
      const { data } = res?.data;
      return data.map((item) => ({ label: item.name, value: item.id }));
    } catch (error) {
      console.log({ error });
    }
  };

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
      render: (_, record) => operatorColumnRender({ record, handleDelete, handleEdit })
    },
    {
      title: 'Thời gian khởi hành',
      dataIndex: 'departure_time',
      hideInSearch: true,
      key: 'departure_time',
      render: (_, record) => convertDateAndFormat(record.departure_time)
    },
    {
      title: 'Thời gian kết thúc',
      dataIndex: 'scheduled_end_time',
      key: 'scheduled_end_time',
      render: (_, record) => convertDateAndFormat(record.scheduled_end_time),
      hideInSearch: true
    },
    {
      title: 'Tuyến đi',
      dataIndex: 'route_start',
      key: 'route_start'
    },
    {
      title: 'Tuyến đến',
      dataIndex: 'route_end',
      key: 'route_end'
    },
    {
      title: 'Tài xế',
      dataIndex: 'driver_id',
      key: 'driver_id',
      valueType: 'select',
      request: handleGetDriverList,
      render: (_, record) => record?.driver?.user?.name
    }
  ];

  const handleReload = () => {
    tableRef.current.reload();
  };

  const handleMultiDelete = async () => {
    try {
      const checkedList = getSelectedRowKeys?.();
      if (!checkedList?.length) {
        toast.error('Vui lòng chọn ít nhất 1 bản ghi để xóa');
        return;
      }
      await multiDeleteTrip({ ids: getSelectedRowKeys() });
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
            >
              <span
                className={`flex items-center justify-center p-3 transition-all bg-white border border-gray-200 rounded-md shadow-sm cursor-pointer hover:bg-gray-200`}
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
