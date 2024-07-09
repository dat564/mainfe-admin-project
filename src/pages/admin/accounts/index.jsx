import React, { useRef, useState } from 'react';
import { getUserList } from 'services';
import { DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import AddAccountModal from './components/AddAccountModal';
import { ROLES } from 'constants';
import { Popconfirm } from 'antd';
import { toast } from 'react-toastify';
import EditAccountModal from './components/EditAccountModal';
import { multipleDeleteUserById } from 'services';
import { GENDER_LABEL } from 'constants';
import { NOTIFY_MESSAGE } from 'constants';
import requireAuthentication from 'hoc/requireAuthentication';
import Setting from 'components/svgs/Setting';
import { ROLES_OBJ } from 'constants';
import { operatorColumnRender } from 'utils/columns';
import Tabular from 'components/Tabular';
import { ROLES_ENUM } from 'constants';

const AccountPage = () => {
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState();

  const tableRef = useRef();

  const { reload: reloadTable, getSelectedRowKeys, setSelectedRowKeys } = tableRef.current || {};

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

  async function handleEdit(record) {
    setSelectedRow(record);
    setShowEditModal(true);
  }

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
      render: (_, record) => operatorColumnRender({ record, handleDelete, handleEdit })
    },
    {
      title: 'Họ và tên',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
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
      key: 'phone'
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
      valueEnum: ROLES_ENUM,
      render: (_, record) => (
        <span>{ROLES_OBJ.find((role) => role.value === record.role)?.label || 'Không xác định'}</span>
      )
    }
  ];

  const onCloseEditModal = () => {
    setSelectedRow({});
    setShowEditModal(false);
  };

  const handleMultiDelete = async () => {
    try {
      const checkedList = getSelectedRowKeys?.();
      if (!checkedList?.length) {
        toast.error('Vui lòng chọn ít nhất 1 bản ghi để xóa');
        return;
      }
      await multipleDeleteUserById({ ids: checkedList });
      setSelectedRowKeys([]);
      reloadTable();
      toast.success('Xóa thành công!');
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
          const { current, pageSize, ...restParams } = params;
          const cloneParams = {
            ...restParams,
            page: current,
            per_size: pageSize
          };
          const res = await getUserList(cloneParams);
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
            <AddAccountModal handleReload={reloadTable} />
            <Popconfirm
              title="Xóa"
              description="Bạn có chắc chấn muốn xóa?"
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
              onConfirm={handleMultiDelete}
            >
              <span
                className={`flex items-center justify-center p-3 transition-all bg-white border border-gray-200 rounded-md shadow-sm cursor-pointer hover:bg-gray-200`}
              >
                <DeleteOutlined />
              </span>
            </Popconfirm>
          </div>
        }
        options={{
          reload: () => {
            setLoading(true);
            tableRef.current.reset();
            setTimeout(() => {
              setLoading(false);
            }, 1000);
          }
        }}
        loading={loading}
      />
      {showEditModal && (
        <EditAccountModal
          show={showEditModal}
          data={selectedRow}
          onClose={onCloseEditModal}
          handleReload={reloadTable}
        />
      )}
    </div>
  );
};

export default requireAuthentication(AccountPage, [ROLES.ADMIN]);
