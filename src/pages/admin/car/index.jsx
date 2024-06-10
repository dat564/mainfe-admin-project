import React, { useRef, useState } from 'react';
import { ProTable } from '@ant-design/pro-components';
import { DeleteOutlined, FolderAddOutlined, QuestionCircleOutlined, SettingOutlined } from '@ant-design/icons';
import { ROLES } from 'constants';
import { Dropdown, Modal, Popconfirm } from 'antd';
import { toast } from 'react-toastify';
import EditCarModal from './components/EditCarModal';
import { multipleDeleteUserById, getCarList } from 'services';
import { NOTIFY_MESSAGE } from 'constants';
import requireAuthentication from 'hoc/requireAuthentication';
import Setting from 'components/svgs/Setting';
import AddModal from 'pages/admin/car/components/AddModal';

const CarPage = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
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
      title: 'Tên xe',
      dataIndex: 'name',
      key: 'name',
      fieldProps: {
        placeholder: 'Search by name...'
      }
    },
    {
      title: 'Số chỗ ngồi',
      dataIndex: 'seating_capacity',
      key: 'seating_capacity'
    },
    {
      title: 'Biển số xe',
      dataIndex: 'license_plate',
      key: 'license_plate'
    },
    {
      title: 'Nơi sản xuất',
      dataIndex: 'manufacture',
      key: 'manufacture'
    },
    {
      title: 'Nhà xe',
      dataIndex: 'transport_company_id',
      key: 'transport_company_id'
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
        dataSource={dataSource || []}
        rowKey={(e) => e.id}
        request={async (params) => {
          setLoading(true);
          const cloneParams = {
            ...params
          };
          const res = await getCarList(cloneParams);
          setDataSource(res.data?.data);
          setLoading(false);
          return {
            data: res.data.data,
            success: true
          };
        }}
        headerTitle={
          <div>
            <h1 className="mt-10 mb-2 text-xl font-medium">Quản lý xe</h1>
            <div className="flex items-center w-full gap-4">
              <span
                className="flex items-center justify-center p-3 transition-all bg-white border border-gray-200 rounded-md shadow-sm cursor-pointer hover:bg-gray-200"
                onClick={() => setShowAddModal(true)}
              >
                <FolderAddOutlined />
              </span>
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
          showSizeChanger: true
        }}
        rowSelection={{ selectedRowKeys, onChange: onSelectChange }}
      />
      {showEditModal && (
        <EditCarModal show={showEditModal} data={selectedRow} onClose={onCloseEditModal} handleReload={handleReload} />
      )}
      {showAddModal && (
        <AddModal handleReload={handleReload} open={showAddModal} handleCancel={() => setShowAddModal(false)} />
      )}
    </div>
  );
};

export default requireAuthentication(CarPage, [ROLES.ADMIN]);
