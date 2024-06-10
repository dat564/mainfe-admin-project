import React, { useRef, useState } from 'react';
import { ProTable } from '@ant-design/pro-components';
import { DeleteOutlined, QuestionCircleOutlined, SettingOutlined } from '@ant-design/icons';
// import AddAccountModal from './components/AddAccountModal';
import { ROLES } from 'constants';
import { Dropdown, Modal, Popconfirm } from 'antd';
import { toast } from 'react-toastify';
// import EditAccountModal from './components/EditAccountModal';
import { multipleDeleteUserById } from 'services';
import { NOTIFY_MESSAGE } from 'constants';
import requireAuthentication from 'hoc/requireAuthentication';
import Setting from 'components/svgs/Setting';
import { getCompanyPaymentList } from 'services/companyPayment';
import AddCalendarTripModal from 'pages/transportCompany/calendarTrip/components/AddCalendarTripModal';
import EditCalendarTripModal from 'pages/transportCompany/calendarTrip/components/EditCalendarTripModal';

const CalendarTripPage = () => {
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
      title: 'Tên tài khoản',
      dataIndex: 'name_bank',
      key: 'name_bank'
    },
    {
      title: 'Số tài khoản',
      dataIndex: 'number_bank',
      key: 'number_bank'
    },
    {
      title: 'Nhà xe',
      dataIndex: 'transport_company',
      key: 'transport_company'
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
          const res = await getCompanyPaymentList(cloneParams);
          setDataSource(res.data?.data);
          setLoading(false);
          return {
            data: res.data.data,
            success: true
          };
        }}
        headerTitle={
          <div>
            <h1 className="mt-10 mb-2 text-xl font-medium">Quản lý lịch trình</h1>
            <div className="flex items-center w-full gap-4">
              <AddCalendarTripModal handleReload={handleReload} />
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
        pagination={false}
        rowSelection={{ selectedRowKeys, onChange: onSelectChange }}
      />
      {showEditModal && (
        <EditCalendarTripModal
          show={showEditModal}
          data={selectedRow}
          onClose={onCloseEditModal}
          handleReload={handleReload}
        />
      )}
    </div>
  );
};

export default requireAuthentication(CalendarTripPage, [ROLES.ADMIN]);
