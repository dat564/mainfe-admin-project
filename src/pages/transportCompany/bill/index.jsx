import React, { useRef, useState } from 'react';
import requireAuthentication from 'hoc/requireAuthentication';
import { ROLES } from 'constants';
import Tabular from 'components/Tabular';
import { getBillList } from 'services/bill';

const BillPage = () => {
  const [loading, setLoading] = useState(false);

  const tableRef = useRef();

  const columns = [
    {
      title: 'Mã đơn',
      dataIndex: 'code',
      key: 'code'
    },
    {
      title: 'Tuyến bắt đầu',
      dataIndex: 'route_start',
      hideInSearch: true,
      key: 'route_start',
      render: (text, record) => record.trip.route_start
    },
    {
      title: 'Tuyến kết thúc',
      dataIndex: 'route_end',
      key: 'route_end',
      hideInSearch: true,
      render: (text, record) => record.trip.route_end
    },
    {
      title: 'Loại xe',
      dataIndex: 'car_type',
      key: 'car_type',
      render: (text, record) => record.trip.car.name
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status'
    },
    {
      title: 'Người đặt',
      dataIndex: 'user',
      key: 'user',
      render: (text, record) => record.user.name
    }
  ];

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
            per_size: params.pageSize,
            page: params.current
          };

          const res = await getBillList(_params);
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
        headerTitle={<h1 className="text-xl font-medium ">Quản lý đơn</h1>}
      />
    </div>
  );
};

export default requireAuthentication(BillPage, [ROLES.TRANSPORT_COMPANY]);
