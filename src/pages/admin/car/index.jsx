import React, { useRef, useState } from 'react';
import { DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { ROLES } from 'constants';
import { Popconfirm } from 'antd';
import { toast } from 'react-toastify';
import EditCarModal from './components/EditCarModal';
import { multipleDeleteUserById, getCarList } from 'services';
import { NOTIFY_MESSAGE } from 'constants';
import requireAuthentication from 'hoc/requireAuthentication';
import Tabular from 'components/Tabular';
import { useSelector } from 'react-redux';
import AddCarModal from 'pages/admin/car/components/AddCarModal';
import Setting from 'components/svgs/Setting';
import { operatorColumnRender } from 'utils/columns';

const CarPage = () => {
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState();
  const { transport_company } = useSelector((state) => state.auth.userInfo) || {};
  const userInfo = useSelector((state) => state.auth.userInfo) || {};

  const tableRef = useRef();

  const { reload: reloadTable, setSelectedRowKeys, getSelectedRowKeys } = tableRef.current || {};

  async function handleDelete(recordId) {
    try {
      setLoading(true);
      await multipleDeleteUserById({ ids: [recordId] });
      toast.success(NOTIFY_MESSAGE.DELETE_SUCCESS);
      setSelectedRowKeys([]);
      tableRef.current.reload();
    } catch (error) {}
    setLoading(false);
  }

  function handleEdit(record) {
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
      render: (_, record) => operatorColumnRender(record, handleDelete, handleEdit)
    },
    {
      title: 'Tên xe',
      dataIndex: 'name',
      key: 'name',
      search: false
    },
    {
      title: 'Số chỗ ngồi',
      dataIndex: 'seating_capacity',
      search: false,
      key: 'seating_capacity'
    },
    {
      title: 'Biển số xe',
      dataIndex: 'license_plate',
      search: false,
      key: 'license_plate'
    },
    {
      title: 'Nơi sản xuất',
      dataIndex: 'manufacture',
      search: false,
      key: 'manufacture'
    },
    {
      title: 'Tìm kiếm',
      dataIndex: 'search',
      hideInTable: true,
      key: 'search'
    }
  ];

  const onCloseEditModal = () => {
    setSelectedRow({});
    setShowEditModal(false);
  };

  const handleReload = () => {
    tableRef.current.reload();
  };

  const handleMultiDelete = async () => {
    try {
      const checkedList = getSelectedRowKeys?.();
      if (!checkedList.length) {
        toast.error('Vui lòng chọn ít nhất 1 bản ghi để xóa');
        return;
      }
      await multipleDeleteUserById({ ids: getSelectedRowKeys() });
      handleReload();
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
          const cloneParams = {
            ...params,
            transport_company_id: transport_company?.id
          };
          const res = await getCarList(cloneParams);
          setLoading(false);
          return {
            data: res.data.data,
            success: true
          };
        }}
        headerTitle={
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-medium ">Quản lý xe</h1>
            <AddCarModal companyId={transport_company?.id} handleReload={reloadTable} />
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
        handleEdit={(record) => {
          setSelectedRow(record);
          setShowEditModal(true);
        }}
      />
      {showEditModal && (
        <EditCarModal
          visible={showEditModal}
          data={selectedRow}
          onClose={onCloseEditModal}
          handleReload={handleReload}
        />
      )}
    </div>
  );
};

export default requireAuthentication(CarPage, [ROLES.TRANSPORT_COMPANY]);
