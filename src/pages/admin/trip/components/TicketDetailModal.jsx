import { Modal } from 'antd';
import Tabular from 'components/Tabular';
import React from 'react';
import { getTicketList } from 'services';
import { convertDatetimeToServer } from 'utils/date';
import { convertDateAndFormat } from 'utils/date';

const TicketDetailModal = ({ open, onCancel, tripData }) => {
  const [loading, setLoading] = React.useState(false);
  const tableRef = React.useRef();

  const columns = [
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
      valueEnum: {
        0: { text: 'Chưa khởi hành', status: 'Processing' },
        1: { text: 'Đang chạy', status: 'Success' },
        2: { text: 'Đã kết thúc', status: 'Error' }
      }
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

  return (
    <Modal open={open} onCancel={onCancel} title={`Vé của chuyến ${tripData.code}`} width="70%">
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
            end_time: convertDatetimeToServer(endTime),
            trip_id: tripData?.id
          };

          const res = await getTicketList(_params);
          setLoading(false);
          return {
            data: res.data.data,
            success: true,
            total: res.data.total
          };
        }}
        scroll={{ y: 300 }}
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
    </Modal>
  );
};

export default TicketDetailModal;
