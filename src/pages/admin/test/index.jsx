import React, { useRef, useState } from 'react';
import { ProTable } from '@ant-design/pro-components';
import { ROLES } from 'constants';
import requireAuthentication from 'hoc/requireAuthentication';

const AccountPage = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState();

  const tableRef = useRef();

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      // renderFormItem: (_, { type, defaultRender, ...rest }) => {
      //   return (
      //     <div>
      //       <label htmlFor="name-search">Tìm tên:</label>
      //       {defaultRender(_)}
      //     </div>
      //   );
      // },
      fieldProps: {
        placeholder: 'Search by name...'
      }
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      fieldProps: {
        placeholder: 'Search by email...'
      }
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      hideInSearch: true
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      fieldProps: {
        placeholder: 'Search by phone...'
      }
    },
    {
      title: 'Date of birth',
      dataIndex: 'birth_day',
      hideInSearch: true,
      key: 'birth_day'
    },
    {
      title: 'Address',
      dataIndex: 'address',
      hideInSearch: true,
      key: 'address'
    },
    {
      title: 'Role',
      dataIndex: 'role',
      valueType: 'select',
      key: 'role',
      valueEnum: {
        1: 'Admin',
        2: 'Accountant',
        3: 'Student'
      },
      render: (text, record) => (
        <span>
          {record.role === ROLES.ADMIN ? 'Admin' : record.role === ROLES.ACCOUNTANT ? 'Accountant' : 'Student'}
        </span>
      ),
      fieldProps: {
        placeholder: 'Select by role...'
      }
    }
  ];

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const onCloseEditModal = () => {
    setSelectedRow({});
    setShowEditModal(false);
  };

  const handleReload = () => {
    tableRef.current.reload();
  };

  return (
    <div className="min-h-[100vh] px-5 mt-10">
      <ProTable
        actionRef={tableRef}
        columns={columns}
        dataSource={dataSource || []}
        rowKey={(e) => e.id}
        headerTitle={<h1 className="mt-10 mb-2 text-xl font-medium">Accounts Table</h1>}
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
        pagination={{
          pageSize: 10
        }}
        rowSelection={{ selectedRowKeys, onChange: onSelectChange }}
      />
    </div>
  );
};

export default requireAuthentication(AccountPage, [ROLES.ADMIN]);
