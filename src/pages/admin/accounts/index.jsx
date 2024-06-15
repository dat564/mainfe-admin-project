import React, { useRef, useState } from 'react';
import { getUserList } from 'services';
import { ProFormText, ProTable } from '@ant-design/pro-components';
import { DeleteOutlined, QuestionCircleOutlined, SettingOutlined } from '@ant-design/icons';
import AddAccountModal from './components/AddAccountModal';
import { ROLES } from 'constants';
import { Dropdown, Modal, Popconfirm, Space } from 'antd';
import { toast } from 'react-toastify';
import EditAccountModal from './components/EditAccountModal';
import { multipleDeleteUserById } from 'services';
import { GENDER_LABEL } from 'constants';
import { NOTIFY_MESSAGE } from 'constants';
import requireAuthentication from 'hoc/requireAuthentication';
import Setting from 'components/svgs/Setting';
import { ROLES_OBJ } from 'constants';
import { renderFormCol } from 'utils';

const AccountPage = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState();

  const tableRef = useRef();

  async function handleDelete(recordId) {
    try {
      setLoading(true);
      await multipleDeleteUserById({ ids: [recordId] });
      toast.success(NOTIFY_MESSAGE.DELETE_SUCCESS);
      tableRef.current.reload();
    } catch (error) {
      toast.error(error.response.data.message);
    }
    setLoading(false);
  }

  const items = [
    {
      key: '1',
      label: 'Xóa'
    },
    {
      key: '2',
      label: 'Sửa'
    }
  ];

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
      render: (text, record) => (
        <div className="flex items-center justify-center">
          <Dropdown
            menu={{
              items,
              onClick: async (e) => {
                switch (e.key) {
                  case '1':
                    Modal.confirm({
                      title: 'Bạn có chắc chắn muốn xóa?',
                      okText: 'Đồng ý',
                      cancelText: 'Hủy',
                      onOk: () => {
                        handleDelete(record.id);
                      }
                    });
                    break;
                  case '2':
                    setShowEditModal(true);
                    setSelectedRow(record);
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
      title: 'Họ và tên',
      dataIndex: 'name',
      key: 'name',
      renderFormItem: renderFormCol
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      renderFormItem: renderFormCol
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
      hideInSearch: true,
      render: (_, record) => GENDER_LABEL[record?.gender]
    },
    {
      title: 'Di động',
      dataIndex: 'phone',
      key: 'phone',
      renderFormItem: renderFormCol
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'birth_day',
      hideInSearch: true,
      key: 'birth_day'
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      hideInSearch: true,
      key: 'address'
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      valueType: 'select',
      key: 'role',
      renderFormItem: renderFormCol,
      render: (_, record) => (
        <span>{ROLES_OBJ.find((role) => role.value === record.role)?.label || 'Không xác định'}</span>
      )
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

  const handleMultiDelete = async () => {
    try {
      await multipleDeleteUserById({ ids: selectedRowKeys });
      handleReload();
      toast.success('Xóa thành công!');
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="min-h-[100vh] px-5 mt-10">
      <ProTable
        actionRef={tableRef}
        columns={columns}
        bordered
        scroll={{ y: 520 }}
        search={true}
        dataSource={dataSource || []}
        rowKey={(e) => e.id}
        request={async (params) => {
          setLoading(true);
          const cloneParams = {
            ...params,
            page: params.current,
            per_size: params.pageSize
          };
          const res = await getUserList(cloneParams);
          setDataSource(res.data?.data);
          setLoading(false);
          return {
            data: res.data.data,
            success: true,
            total: res.data.total
          };
        }}
        headerTitle={
          <div className="flex items-center gap-2">
            <h1 className="mb-2 text-xl font-medium">Quản lý tài khoản</h1>
            <AddAccountModal handleReload={handleReload} />
            <Popconfirm
              title="Xóa"
              description="Bạn có chắc chấn muốn xóa?"
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
              onConfirm={handleMultiDelete}
              disabled={selectedRowKeys.length <= 0}
            >
              <span
                className={`flex items-center justify-center p-3 transition-all bg-white border border-gray-200 rounded-md shadow-sm cursor-pointer hover:bg-gray-200 ${
                  selectedRowKeys.length <= 0 ? 'cursor-not-allowed' : ''
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
        pagination={{
          pageSize: 10,
          showSizeChanger: false
        }}
        rowSelection={{ selectedRowKeys, onChange: onSelectChange }}
      />
      {showEditModal && (
        <EditAccountModal
          show={showEditModal}
          data={selectedRow}
          onClose={onCloseEditModal}
          handleReload={handleReload}
        />
      )}
    </div>
  );
};

export default requireAuthentication(AccountPage, [ROLES.ADMIN]);
