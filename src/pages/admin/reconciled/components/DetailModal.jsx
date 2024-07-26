import { Modal } from 'antd';
import Tabular from 'components/Tabular';
import React, { useMemo, useRef, useState } from 'react';
import { getDetailReconciled } from 'services/reconciled';

const DetailModal = ({ visible, handleCancel, data, isSubmit = true }) => {
  const tableRef = useRef();
  const [loading, setLoading] = useState(false);
  const transport_company = useMemo(() => data?.transport_company, [data]);

  const columns = [
    {
      title: 'Các Chuyến',
      dataIndex: 'trips',
      search: false,
      key: 'trips',
      render: (_, record) => record?.trips?.map((trip) => trip.code).join(', ')
    },
    {
      title: 'Số tiền chưa đối soát',
      dataIndex: 'unreconciled_amount',
      search: false,
      key: 'unreconciled_amount'
    },
    {
      title: 'Tổng số tiền đã đối soát',
      dataIndex: 'total_reconciled_amount',
      search: false,
      key: 'total_reconciled_amount'
    },

    {
      title: 'Tìm kiếm',
      dataIndex: 'search',
      hideInTable: true,
      key: 'search'
    }
  ];

  return (
    <Modal width={'70%'} open={visible} onCancel={handleCancel} footer={false} title="Chi tiết đối soát của nhà xe">
      <Tabular
        ref={tableRef}
        columns={columns}
        bordered
        rowKey={(e) => e.id}
        request={async (params) => {
          setLoading(true);
          const cloneParams = {
            ...params,
            transport_company_id: transport_company?.id
          };
          const res = await getDetailReconciled(cloneParams);
          setLoading(false);
          return {
            data: res.data.data,
            success: true
          };
        }}
        headerTitle={
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-medium">Quản lý thông tin đối soát</h1>
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
      />
    </Modal>
  );
};

export default DetailModal;
