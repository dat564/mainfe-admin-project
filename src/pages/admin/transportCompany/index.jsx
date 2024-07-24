import React, { useRef, useState } from 'react';
import { DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import AddTransportCompanyModal from './components/AddTransportCompanyModal';
import { Popconfirm } from 'antd';
import { toast } from 'react-toastify';
import EditTransportCompanyModal from './components/EditTransportCompanyModal';
import requireAuthentication from 'hoc/requireAuthentication';
import Setting from 'components/svgs/Setting';
import { getTransportCompany } from 'services';
import { ROLES } from 'constants';
import Tabular from 'components/Tabular';
import { operatorColumnRender } from 'utils/columns';
import { multipleDeleteUserById } from 'services';
import { image_url } from 'configs/images';
import { NOTIFY_MESSAGE } from 'constants';

const MODAL_TYPE = {
  ADD: 'ADD',
  EDIT: 'EDIT'
};

const TransportCompanyPage = () => {
  const [loading, setLoading] = useState(false);
  const [modalConfig, setModalConfig] = useState({ type: null, data: {} });

  const tableRef = useRef();
  const { getSelectedRowKeys, setSelectedRowKeys, reload: reloadTable } = tableRef.current || {};

  async function handleDelete(recordId) {
    try {
      setLoading(true);
      await multipleDeleteUserById({ ids: [recordId] });
      toast.success(NOTIFY_MESSAGE.DELETE_SUCCESS);
      setSelectedRowKeys([]);
      reloadTable();
    } catch (error) {}
    setLoading(false);
  }

  async function handleEdit(record) {
    setModalConfig({
      type: MODAL_TYPE.EDIT,
      data: {
        ...record,
        id: record.transportCompanyId
      }
    });
  }

  const columns = [
    {
      title: (
        <div className="flex items-center justify-center">
          <Setting />
        </div>
      ),
      dataIndex: 'settings',
      hideInSearch: true,
      width: 100,
      key: 'settings',
      search: false,
      align: 'center',
      render: (_, record) => operatorColumnRender({ record, handleDelete, handleEdit })
    },
    {
      title: 'Ảnh',
      dataIndex: 'img_url',
      key: 'img_url',
      search: false,
      render: (_, record) =>
        record.img_url && (
          <img src={`${image_url}${record.img_url}`} alt={record.name} className="object-cover w-20 h-20" />
        )
    },
    {
      title: 'Tên nhà xe',
      dataIndex: 'name',
      search: false,
      key: 'name'
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      search: false,
      key: 'address'
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      search: false,
      key: 'phone'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      search: false,
      key: 'email'
    },
    {
      title: 'Tìm kiếm',
      dataIndex: 'search',
      key: 'search',
      hideInTable: true
    }
  ];

  const onCloseEditModal = () => {
    setModalConfig({ type: null, data: {} });
  };

  const handleMultiDelete = async () => {
    try {
      const checkedList = getSelectedRowKeys?.();
      if (!checkedList?.length) {
        toast.error('Please select at least 1 record to delete');
        return;
      }
      await multipleDeleteUserById({ ids: getSelectedRowKeys() });
      setSelectedRowKeys([]);
      reloadTable();
      toast.success(NOTIFY_MESSAGE.DELETE_SUCCESS);
    } catch (error) {}
  };

  return (
    <div className="min-h-[100vh] px-5 mt-10">
      <Tabular
        ref={tableRef}
        columns={columns}
        rowKey={(e) => e.id}
        request={async (params) => {
          setLoading(true);
          const { pageSize, current, name } = params;
          const _params = {
            name,
            per_size: pageSize,
            page: current
          };

          const res = await getTransportCompany(_params);
          const data = res.data.data.map((item) => {
            return {
              ...item.user,
              ...item,
              id: item.user.id,
              transportCompanyId: item.id,
              key: item.user.id
            };
          });

          setLoading(false);
          return {
            data: data,
            success: true,
            total: res.data.total
          };
        }}
        headerTitle={
          <div className="flex items-center gap-2">
            <h1 className="mb-2 text-xl font-medium ">Quản lý nhà xe</h1>
            <AddTransportCompanyModal reloadTable={reloadTable} />
            <Popconfirm
              title="Xóa"
              description="Bạn có chắc chắn muốn xóa?"
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
              onConfirm={handleMultiDelete}
            >
              <span className="flex items-center justify-center p-3 transition-all bg-white border border-gray-200 rounded-md shadow-sm cursor-pointer hover:bg-gray-200">
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
        handleDelete={handleDelete}
      />
      {modalConfig.type === MODAL_TYPE.EDIT && (
        <EditTransportCompanyModal
          show={modalConfig.type === MODAL_TYPE.EDIT}
          data={modalConfig.data}
          onClose={onCloseEditModal}
          reloadTable={reloadTable}
        />
      )}
    </div>
  );
};
export default requireAuthentication(TransportCompanyPage, [ROLES.ADMIN]);
