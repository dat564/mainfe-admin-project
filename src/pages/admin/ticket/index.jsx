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
import { renderFormCol } from 'utils';

const TicketPage = () => {
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});

  const tableRef = useRef();
  const { reload: reloadTable, selectedRowKeys, setSelectedRowKeys } = tableRef.current || {};

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

  const columns = [
    {
      title: 'Mã vé',
      dataIndex: 'code',
      key: 'code',
      renderFormItem: renderFormCol
    },
    {
      title: 'Giá vé',
      dataIndex: 'price',
      key: 'price',
      renderFormItem: renderFormCol
    },
    {
      title: 'Số ghế',
      dataIndex: 'seat_number',
      key: 'seat_number',
      renderFormItem: renderFormCol
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      valueEnum: {
        0: { text: 'Chưa khởi hành', status: 'Processing' },
        1: { text: 'Đang chạy', status: 'Success' },
        2: { text: 'Đã kết thúc', status: 'Error' }
      },
      renderFormItem: renderFormCol
    },
    {
      title: 'Thời gian mua',
      dataIndex: 'purchase_time',
      key: 'purchase_time',
      render: (_, record) => formatTime(record.purchase_time),
      renderFormItem: renderFormCol
    },
    {
      title: 'Chuyến',
      dataIndex: 'trip_id',
      key: 'trip_id',
      renderFormItem: renderFormCol
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customer_id',
      key: 'customer_id',
      renderFormItem: renderFormCol
    },
    {
      title: 'Hình thức thanh toán',
      dataIndex: 'transport_company_payment_id',
      key: 'transport_company_payment_id',
      renderFormItem: renderFormCol
    }
  ];

  const handleMultiDelete = async () => {
    try {
      await multiDeleteTicket({ ids: selectedRowKeys });
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
          setLoading(true);
          const _params = {
            ...params,
            per_size: params.pageSize,
            page: params.current,
            start_time: params?.dateRange && params.dateRange[0],
            end_time: params?.dateRange && params.dateRange[1]
          };

          const res = await getTicketList(_params);
          setLoading(false);
          return {
            data: res.data.batchFees,
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
