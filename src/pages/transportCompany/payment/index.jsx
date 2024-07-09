import React, { useRef, useState } from 'react';
import { ROLES } from 'constants';
import requireAuthentication from 'hoc/requireAuthentication';
import Tabular from 'components/Tabular';
import { useSelector } from 'react-redux';
import { getDetailReconciled } from 'services/reconciled';

const TransportCompanyPaymentPage = () => {
  const [loading, setLoading] = useState(false);
  const { transport_company } = useSelector((state) => state.auth.userInfo) || {};

  const tableRef = useRef();

  const columns = [
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
    <div className="min-h-[100vh] px-5 mt-10">
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
    </div>
  );
};

export default requireAuthentication(TransportCompanyPaymentPage, [ROLES.TRANSPORT_COMPANY]);
