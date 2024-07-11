import React, { useRef, useState } from 'react';
import { getUserList } from 'services';
import { DeleteOutlined, QuestionCircleOutlined, SettingOutlined } from '@ant-design/icons';
import { ROLES } from 'constants';
import { Dropdown, Modal, Popconfirm } from 'antd';
import { toast } from 'react-toastify';
import { multipleDeleteUserById } from 'services';
import { GENDER_LABEL } from 'constants';
import { NOTIFY_MESSAGE } from 'constants';
import requireAuthentication from 'hoc/requireAuthentication';
import Setting from 'components/svgs/Setting';
import Tabular from 'components/Tabular';
import AddDriverModal from './components/AddDriverModal';
import EditDriverModal from './components/EditDriverModal';
import { useSelector } from 'react-redux';
import CalendarDriverModal from 'pages/transportCompany/drivers/components/CalendarDriverModal';

const items = [
  {
    label: 'Sửa',
    key: '2'
  },
  {
    key: '1',
    label: 'Xóa'
  },
  {
    label: 'Xem lịch trình tài xế',
    key: 'calendar-driver'
  }
];

const TypeModal = {
  CalendarDriver: 'calendar-driver'
};

const DriverPage = () => {
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState();
  const { transport_company } = useSelector((state) => state.auth.userInfo);
  const [configModal, setConfigModal] = useState({
    visible: false,
    data: null,
    type: ''
  });

  const handleCloseModal = () => {
    setConfigModal({ visible: false, data: null, type: '' });
  };

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
                    handleEdit(record);
                    break;
                  case 'calendar-driver':
                    setConfigModal({
                      visible: true,
                      data: { ...record, id: record?.driver?.id },
                      type: TypeModal.CalendarDriver
                    });
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
      await multipleDeleteUserById({ ids: getSelectedRowKeys() });
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
            per_size: pageSize,
            role: ROLES.DRIVER,
            transport_company_id: transport_company.id
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
            <h1 className="mb-2 text-xl font-medium">Quản lý tài xế</h1>
            <AddDriverModal handleReload={reloadTable} />
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
        <EditDriverModal
          show={showEditModal}
          data={selectedRow}
          onClose={onCloseEditModal}
          handleReload={reloadTable}
        />
      )}
      {configModal.visible && configModal.type === TypeModal.CalendarDriver && (
        <CalendarDriverModal open={configModal.visible} driver={configModal.data} handleClose={handleCloseModal} />
      )}
    </div>
  );
};

export default requireAuthentication(DriverPage, [ROLES.TRANSPORT_COMPANY]);
