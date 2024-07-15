import React, { useRef, useState } from 'react';
import { DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { formatTime } from 'utils/utils';
import { Popconfirm } from 'antd';
import { toast } from 'react-toastify';
import requireAuthentication from 'hoc/requireAuthentication';
import { ROLES } from 'constants';
import { getTicketList } from 'services/ticket';
import { NOTIFY_MESSAGE } from 'constants';
import Tabular from 'components/Tabular';
import EditTicket from 'pages/admin/ticket/components/EditTicket';
import AddTicket from 'pages/admin/ticket/components/AddTicket';
import { multiDeleteTicket } from 'services';
import { getTripList } from 'services';
import Setting from 'components/svgs/Setting';
import { operatorColumnRender } from 'utils/columns';
import { convertDatetimeToServer } from 'utils/date';
import { convertDateAndFormat } from 'utils/date';
import { TICKET_STATUS_ENUM } from 'constants';

const TicketPage = () => {
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});

  const tableRef = useRef();
  const { reload: reloadTable, getSelectedRowKeys, setSelectedRowKeys } = tableRef.current || {};

  async function handleDelete(recordId) {
    try {
      setLoading(true);
      await multiDeleteTicket({ ids: [recordId] });
      setSelectedRowKeys([]);
      toast.success(NOTIFY_MESSAGE.ADD_SUCCESS);
      reloadTable();
    } catch (error) {
      toast.error(error.response.data.message);
    }
    setLoading(false);
  }

  async function handleGetTripList() {
    try {
      const res = await getTripList();
      const { data } = res?.data;
      return data.map((item) => ({ label: item.code, value: item.id }));
    } catch (error) {
      console.log({ error });
    }
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
      title: 'Tìm kiếm',
      dataIndex: 'name_or_code',
      hideInTable: true,
      key: 'name_or_code'
    },
    {
      title: 'Mã vé',
      dataIndex: 'code',
      search: false,
      key: 'code'
    },
    {
      title: 'Giá vé',
      dataIndex: 'price',
      key: 'price',
      search: false
    },
    {
      title: 'Số ghế',
      dataIndex: 'position_on_car',
      key: 'position_on_car',
      search: false,
      render: (_, record) => record?.position_on_car + 1
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      search: false,
      options: TICKET_STATUS_ENUM
    },
    {
      title: 'Thời gian mua',
      dataIndex: 'purchase_time',
      key: 'purchase_time',
      valueType: 'dateTimeRange',
      fieldProps: {
        format: 'DD/MM/YYYY HH:mm:ss'
      },
      render: (_, record) => convertDateAndFormat(record.purchase_time)
    },
    {
      title: 'Chuyến',
      dataIndex: 'trip_id',
      key: 'trip_id',
      hideInTable: true,
      valueType: 'select',
      request: handleGetTripList
    },
    {
      title: 'Điểm xuất phát',
      dataIndex: 'route_start',
      key: 'route_start',
      search: false,
      valueType: 'select',
      render: (_, record) => record?.trip?.route_start
    },
    {
      title: 'Điểm đến',
      dataIndex: 'route_end',
      key: 'route_end',
      search: false,
      valueType: 'select',
      render: (_, record) => record?.trip?.route_end
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customer_id',
      key: 'customer_id',
      search: false
    }
  ];

  const handleMultiDelete = async () => {
    try {
      const checkedList = getSelectedRowKeys?.();
      if (!checkedList.length) {
        toast.error('Vui lòng chọn ít nhất 1 bản ghi để xóa');
        return;
      }
      await multiDeleteTicket({ ids: getSelectedRowKeys() });
      reloadTable();
      toast.success('Delete successfully!');
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
          const { current, pageSize, purchase_time, ...rest } = params;
          const [startTime, endTime] = purchase_time || [];
          setLoading(true);
          const _params = {
            ...rest,
            per_size: pageSize,
            page: current,
            start_time: convertDatetimeToServer(startTime),
            end_time: convertDatetimeToServer(endTime)
          };

          const res = await getTicketList(_params);
          setLoading(false);
          return {
            data: res.data.data,
            success: true,
            total: res.data.total
          };
        }}
        headerTitle={
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-medium">Quản lý vé</h1>
            <AddTicket handleReload={reloadTable} />
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
      {showEditModal && (
        <EditTicket
          handleReload={handleDelete}
          visible={showEditModal}
          onClose={() => setShowEditModal(false)}
          data={selectedRow}
        />
      )}
    </div>
  );
};

export default requireAuthentication(TicketPage, [ROLES.TRANSPORT_COMPANY]);
