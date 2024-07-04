import React, { useRef, useState } from 'react';
import requireAuthentication from 'hoc/requireAuthentication';
import { ROLES } from 'constants';
import Tabular from 'components/Tabular';
import { getBillList } from 'services/bill';
import { getRatingList } from 'services/rating';
import { billLabel } from 'constants/bill';

const RatingPage = () => {
  const [loading, setLoading] = useState(false);

  const tableRef = useRef();

  const columns = [
    {
      title: 'Tuyến bắt đầu',
      dataIndex: 'route_start',
      hideInSearch: true,
      key: 'route_start'
    },
    {
      title: 'Tuyến kết thúc',
      dataIndex: 'route_end',
      key: 'route_end',
      hideInSearch: true
    },
    {
      title: 'Loại xe',
      dataIndex: 'car_type',
      key: 'car_type'
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => billLabel[record.status]
    },
    {
      title: 'Người đặt',
      dataIndex: 'user',
      key: 'user'
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

          const res = await getRatingList(_params);
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

export default requireAuthentication(RatingPage, [ROLES.TRANSPORT_COMPANY]);
