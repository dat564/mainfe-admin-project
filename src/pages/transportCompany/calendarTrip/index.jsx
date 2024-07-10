import React, { useRef, useState } from 'react';
import { DeleteOutlined, FolderAddOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { ROLES } from 'constants';
import { Popconfirm } from 'antd';
import { toast } from 'react-toastify';
import { multipleDeleteUserById } from 'services';
import { NOTIFY_MESSAGE } from 'constants';
import requireAuthentication from 'hoc/requireAuthentication';
import { getCalendarTripList } from 'services';
import Tabular from 'components/Tabular';
import StepsFormModal from './components/StepsFormModal';
import Setting from 'components/svgs/Setting';
import { operatorColumnRender } from 'utils/columns';
import { multiDeleteCalendarTrip } from 'services';
import { convertDatetimeToServer } from 'utils/date';
import { convertDatetime } from 'utils/date';
import { ProFormSwitch } from '@ant-design/pro-components';

const CalendarTripPage = () => {
  const [loading, setLoading] = useState(false);
  const [configModal, setConfigModal] = useState({
    visible: false,
    selectedRow: null
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState();

  const tableRef = useRef();

  const { getSelectedRowKeys, setSelectedRowKeys, reload: reloadTable } = tableRef.current || {};

  async function handleDelete(recordId) {
    try {
      setLoading(true);
      await multipleDeleteUserById({ ids: [recordId] });
      toast.success(NOTIFY_MESSAGE.DELETE_SUCCESS);
      setSelectedRowKeys([]);
      reloadTable();
    } catch (error) {
      toast.error(error.response.data.message);
    }
    setLoading(false);
  }

  function handleEdit(record) {
    setSelectedRow(record);
    setShowEditModal(true);
  }

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
      title: 'Tên lịch trình',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Thời gian áp dụng',
      dataIndex: 'start_time',
      search: false,
      key: 'start_time',
      render: (text, record) => convertDatetime(record.start_time)
    },
    {
      title: 'Thời gian kết thúc',
      dataIndex: 'end_time',
      search: false,
      key: 'end_time',
      render: (text, record) => convertDatetime(record.end_time)
    },
    {
      title: 'Trạng thái',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (_, record) => <ProFormSwitch disabled fieldProps={{
        value: record.is_active
      }} />
    },
    {
      title: 'Khoảng thời gian',
      dataIndex: 'time_range',
      key: 'time_range',
      valueType: 'dateTimeRange',
      hideInTable: true,
      fieldProps: {
        format: 'DD/MM/YYYY HH:mm:ss'
      }
    }
  ];

  const onCloseEditModal = () => {
    setSelectedRow({});
    setShowEditModal(false);
  };

  const handleMultiDelete = async () => {
    try {
      const checkedList = getSelectedRowKeys?.();
      if (!checkedList?.length) {
        toast.error('Vui lòng chọn ít nhất 1 bản ghi để xóa');
        return;
      }
      await multiDeleteCalendarTrip({ ids: getSelectedRowKeys() });
      reloadTable();
      toast.success('Xóa thành công!');
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="min-h-[100vh] px-5 mt-10">
      <Tabular
        ref={tableRef}
        columns={columns}
        rowKey={(e) => e.id}
        request={async (params) => {
          const { time_range } = params;
          const [startTime, endTime] = time_range || [];
          setLoading(true);
          const cloneParams = {
            ...params,
            start_time: convertDatetimeToServer(startTime),
            end_time: convertDatetimeToServer(endTime)
          };
          const res = await getCalendarTripList(cloneParams);
          setLoading(false);
          return {
            data: res.data.data,
            success: true
          };
        }}
        headerTitle={
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-medium ">Quản lý lịch trình</h1>
            <span
              className="flex items-center justify-center p-3 transition-all bg-white border border-gray-200 rounded-md shadow-sm cursor-pointer hover:bg-gray-200"
              onClick={() => setShowAddModal(true)}
            >
              <FolderAddOutlined />
            </span>
            <Popconfirm
              title="Xóa"
              description="Bạn có chắc chấn muốn xóa?"
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
              onConfirm={handleMultiDelete}
            >
              <span
                className={`flex items-center justify-center p-3 transition-all bg-white border border-gray-200 rounded-md shadow-sm cursor-pointer hover:bg-gray-200 `}
              >
                <DeleteOutlined />
              </span>
            </Popconfirm>
          </div>
        }
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
        handleDelete={handleDelete}
        handleEdit={(record) => {
          setSelectedRow(record);
          setShowEditModal(true);
        }}
      />
      {showAddModal && (
        <StepsFormModal handleReload={reloadTable} open={showAddModal} handleCancel={() => setShowAddModal(false)} />
      )}
      {showEditModal && (
        <StepsFormModal
          open={showEditModal}
          data={selectedRow}
          handleCancel={onCloseEditModal}
          handleReload={reloadTable}
        />
      )}
    </div>
  );
};

export default requireAuthentication(CalendarTripPage, [ROLES.TRANSPORT_COMPANY]);
