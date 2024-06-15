import React, { useRef, useState } from 'react';
import { ProTable } from '@ant-design/pro-components';
import { DeleteOutlined, QuestionCircleOutlined, SettingOutlined } from '@ant-design/icons';
import AddTransportCompanyModal from './components/AddTransportCompanyModal';
import { Dropdown, Modal, Popconfirm } from 'antd';
import { toast } from 'react-toastify';
import EditTransportCompanyModal from './components/EditTransportCompanyModal';
import requireAuthentication from 'hoc/requireAuthentication';
import Setting from 'components/svgs/Setting';
import { getTransportCompany } from 'services';
import { ROLES } from 'constants';
import { renderFormCol } from 'utils';

const TransportCompanyPage = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState();

  const tableRef = useRef();

  async function handleDelete(recordId) {
    try {
      setLoading(true);
      // await deleteMajorById(recordId);
      toast.success('Delete successfully!');
      handleReload();
    } catch (error) {
      toast.error(error.response.data.message);
    }
    setLoading(false);
  }

  const items = [
    {
      label: 'Sửa',
      key: '2'
    },
    {
      key: '1',
      label: 'Xóa'
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
      hideInSearch: true,
      width: 100,
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
      key: 'name',
      renderFormItem: renderFormCol
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      renderFormItem: renderFormCol,
      key: 'address'
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      renderFormItem: renderFormCol,
      key: 'phone'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      renderFormItem: renderFormCol,
      key: 'email'
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
      // await multipleDeleteMajorById({ ids: selectedRowKeys });
      handleReload();
      toast.success('Delete successfully!');
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="min-h-[100vh] px-5 mt-10">
      <ProTable
        actionRef={tableRef}
        columns={columns}
        dataSource={dataSource || []}
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

          setDataSource(data);
          setLoading(false);
          return {
            data: data,
            success: true,
            total: res.data.total
          };
        }}
        scroll={{ y: 520 }}
        headerTitle={
          <div className="flex items-center gap-2">
            <h1 className="mb-2 text-xl font-medium ">Quản lý nhà xe</h1>
            <AddTransportCompanyModal handleReload={handleReload} />
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
        pagination={{
          pageSize: 10
        }}
        search={{
          labelWidth: 'auto'
        }}
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
        rowSelection={{ selectedRowKeys, onChange: onSelectChange }}
      />
      {showEditModal && (
        <EditTransportCompanyModal
          show={showEditModal}
          data={selectedRow}
          onClose={onCloseEditModal}
          handleReload={handleReload}
        />
      )}
    </div>
  );
};
export default requireAuthentication(TransportCompanyPage, [ROLES.ADMIN]);
