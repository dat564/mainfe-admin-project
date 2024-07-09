import React, { useRef, useState } from 'react';
import { ROLES } from 'constants';
import requireAuthentication from 'hoc/requireAuthentication';
import Tabular from 'components/Tabular';
import AddReconciledModal from 'pages/admin/reconciled/components/AddReconciledModal';
import { getReconciledList } from 'services/reconciled';
import { SettingOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';
import Setting from 'components/svgs/Setting';

const items = [
  {
    label: 'Đối soát',
    key: 'reconcile'
  }
];

const TransportCompanyPaymentPage = () => {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const tableRef = useRef();

  const { reload: reloadTable } = tableRef.current || {};

  // tính năng sẽ gồm các thông tin : tên nhà xe, số tiền chưa đối soát (bấm vào tên nhà xe cần ra được thông tin đối soát của nhà xe đó) và cột tổng số tiền đã đối soát từ trước tới nay,  BE cần dựng thêm DB lưu thông tin các lần đối soát
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
      render: (_, record) => (
        <div className="flex items-center justify-center">
          <Dropdown
            menu={{
              items,
              onClick: async (e) => {
                switch (e.key) {
                  case 'reconcile':
                    setVisible(true);
                    break;
                  default:
                }
              }
            }}
            trigger={['click']}
          >
            <div className="flex items-center justify-center w-10 h-10 font-medium transition-all bg-white border border-blue-500 rounded-md cursor-pointer hover:bg-blue-500 hover:text-white">
              <SettingOutlined />
            </div>
          </Dropdown>
        </div>
      )
    },
    {
      title: 'Tên nhà xe',
      dataIndex: 'transport_company_name',
      search: false,
      key: 'transport_company_name',
      render: (_, record) => <span className="font-medium">{record.transport_company.name}</span>
    },
    {
      title: 'Số tiền chưa đối soát',
      dataIndex: 'unreconciled_amount',
      search: false,
      key: 'unreconciled_amount'
    },
    {
      title: 'Tổng số tiền đã đối soát',
      dataIndex: 'reconciled_amount',
      search: false,
      key: 'reconciled_amount'
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
            ...params
          };
          const res = await getReconciledList(cloneParams);
          setLoading(false);
          return {
            data: res.data.data,
            success: true
          };
        }}
        headerTitle={
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-medium">Quản lý thông tin đối soát</h1>
            <AddReconciledModal handleReload={reloadTable} />
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
      {visible && (
        <AddReconciledModal handleReload={reloadTable} handleCancel={() => setVisible(false)} visible={visible} />
      )}
    </div>
  );
};

export default requireAuthentication(TransportCompanyPaymentPage, [ROLES.ADMIN]);
