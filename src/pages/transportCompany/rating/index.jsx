import React, { useRef, useState } from 'react';
import requireAuthentication from 'hoc/requireAuthentication';
import { ROLES } from 'constants';
import Tabular from 'components/Tabular';
import { getRatingList } from 'services/rating';
import { convertDateAndFormat } from 'utils/date';

const RatingPage = () => {
  const [loading, setLoading] = useState(false);

  const tableRef = useRef();

  const columns = [
    {
      title: 'Mã đơn',
      dataIndex: 'bill_code',
      key: 'bill_code',
      render: (_, record) => record.bill?.code
    },
    {
      title: 'Mã chuyến',
      dataIndex: 'trip_id',
      key: 'trip_id',
      search: false,
      render: (_, record) => `${record.bill?.trip.route_start} ➡️ ${record.bill?.trip.route_end}`
    },
    {
      title: 'Đánh giá tài xế',
      dataIndex: 'rate_driver',
      search: false,
      key: 'rate_driver',
      render: (_, record) => `${record.rate_driver} ⭐`
    },
    {
      title: 'Đánh giá chuyến',
      dataIndex: 'rate_trip',
      search: false,
      key: 'rate_trip',
      render: (_, record) => `${record.rate_trip} ⭐`
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      search: false,
      key: 'created_at',
      render: (text) => convertDateAndFormat(text)
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updated_at',
      search: false,
      key: 'updated_at',
      render: (text) => convertDateAndFormat(text)
    },
    {
      title: 'Đánh giá tài xế thấp nhất',
      dataIndex: 'driver_rating_min',
      key: 'driver_rating_min',
      hideInTable: true
    },
    {
      title: 'Đánh giá tài xế cao nhất',
      dataIndex: 'driver_rating_max',
      key: 'driver_rating_max',
      hideInTable: true
    },
    {
      title: 'Đánh giá chuyến thấp nhất',
      dataIndex: 'trip_rating_min',
      key: 'trip_rating_min',
      hideInTable: true
    },
    {
      title: 'Đánh giá chuyến cao nhất',
      dataIndex: 'trip_rating_max',
      key: 'trip_rating_max',
      hideInTable: true
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
        headerTitle={<h1 className="text-xl font-medium ">Quản lý đánh giá</h1>}
      />
    </div>
  );
};

export default requireAuthentication(RatingPage, [ROLES.TRANSPORT_COMPANY]);
