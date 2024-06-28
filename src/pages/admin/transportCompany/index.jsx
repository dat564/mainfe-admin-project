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
import { multiDeleteTransportCompany } from 'services';

const MODAL_TYPE = {
  ADD: 'ADD',
  EDIT: 'EDIT'
};

const TransportCompanyPage = () => {
  const [loading, setLoading] = useState(false);
  const [modalConfig, setModalConfig] = useState({ type: null, data: {} });

  const tableRef = useRef();
  const { selectedRowKeys, setSelectedRowKeys, reload: reloadTable } = tableRef.current || {};

  async function handleDelete(recordId) {
    try {
      setLoading(true);
      // await deleteMajorById(recordId);
      toast.success('Delete successfully!');
      reloadTable();
      setSelectedRowKeys([]);
    } catch (error) {
      toast.error(error.response.data.message);
    }
    setLoading(false);
  }

  async function handleEdit(record) {
    setModalConfig({ type: MODAL_TYPE.EDIT, data: record });
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
      render: (_, record) => operatorColumnRender(record, handleDelete, handleEdit)
    },
    {
      title: 'Ảnh',
      dataIndex: 'img_url',
      key: 'img_url',
      search: false,
      render: (_, record) => (
        <img src={record.img_url} alt={record.name} className="object-cover w-10 h-10 rounded-full" />
      )
    },
    {
      title: 'Tên nhà xe',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address'
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    }
  ];

  const onCloseEditModal = () => {
    setModalConfig({ type: null, data: {} });
  };

  const handleMultiDelete = async () => {
    try {
      await multiDeleteTransportCompany({ ids: selectedRowKeys });
      reloadTable();
      toast.success('Delete successfully!');
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
              key: item.id
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
              title="Delete"
              description="Are you sure to delete?"
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
