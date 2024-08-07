import React, { useRef, useState } from 'react';
import { DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { ROLES } from 'constants';
import { Button, Popconfirm } from 'antd';
import { toast } from 'react-toastify';
import { NOTIFY_MESSAGE } from 'constants';
import requireAuthentication from 'hoc/requireAuthentication';
import AddPaymentModal from 'pages/transportCompany/payment/components/AddPaymentModal';
import EditPaymentModal from 'pages/transportCompany/payment/components/EditPaymentModal';
import { getCompanyPaymentList } from 'services/companyPayment';
import Tabular from 'components/Tabular';
import { useSelector } from 'react-redux';
import Setting from 'components/svgs/Setting';
import { operatorColumnRender } from 'utils/columns';
import { ProFormSwitch } from '@ant-design/pro-components';
import { multiDeleteCompanyPayment } from 'services';
import DetailModal from 'pages/admin/reconciled/components/DetailModal';

const ModalType = {
  DETAIL: 'DETAIL'
};

const TransportCompanyPaymentPage = () => {
  const [loading, setLoading] = useState(false);
  const [configModal, setConfigModal] = useState({
    visible: false,
    data: null,
    type: null
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState();
  const { transport_company } = useSelector((state) => state.auth.userInfo) || {};

  const tableRef = useRef();

  const { getSelectedRowKeys, setSelectedRowKeys, reload: reloadTable } = tableRef.current || {};

  async function handleDelete(recordId) {
    try {
      setLoading(true);
      await multiDeleteCompanyPayment({ ids: [recordId] });
      setSelectedRowKeys([]);
      toast.success(NOTIFY_MESSAGE.DELETE_SUCCESS);
      reloadTable();
    } catch (error) {
      toast.error(error.response.data.message);
    }
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
      render: (_, record) => operatorColumnRender({ record, handleDelete, handleEdit })
    },
    {
      title: 'Tên tài khoản',
      dataIndex: 'name_bank',
      search: false,
      key: 'name_bank'
    },
    {
      title: 'Số tài khoản',
      dataIndex: 'number_bank',
      search: false,
      key: 'number_bank'
    },
    {
      title: 'Mặc định',
      dataIndex: 'is_default',
      key: 'is_default',
      render: (_, record) => (
        <ProFormSwitch
          fieldProps={{
            value: record.is_default
          }}
          disabled
        ></ProFormSwitch>
      )
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

  const handleMultiDelete = async () => {
    try {
      const checkedList = getSelectedRowKeys?.();
      if (!checkedList?.length) {
        toast.error('Vui lòng chọn ít nhất một bản ghi để xóa!');
        return;
      }
      await multiDeleteCompanyPayment({ ids: getSelectedRowKeys() });
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
        bordered
        rowKey={(e) => e.id}
        request={async (params) => {
          setLoading(true);
          const cloneParams = {
            ...params,
            transport_company_id: transport_company?.id
          };
          const res = await getCompanyPaymentList(cloneParams);
          setLoading(false);
          return {
            data: res.data.data,
            success: true
          };
        }}
        headerTitle={
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-medium">Quản lý thông tin đối soát</h1>
            <AddPaymentModal handleReload={reloadTable} />
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
            <Button
              onClick={() =>
                setConfigModal({
                  visible: true,
                  data: {
                    transport_company: {
                      id: transport_company?.id
                    }
                  },
                  type: ModalType.DETAIL
                })
              }
            >
              Xem chi tiết thông tin đối soát
            </Button>
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
      />
      {showEditModal && (
        <EditPaymentModal
          visible={showEditModal}
          data={selectedRow}
          onClose={onCloseEditModal}
          handleReload={reloadTable}
        />
      )}
      {configModal.visible && configModal.type === ModalType.DETAIL && (
        <DetailModal
          handleReload={reloadTable}
          data={configModal.data}
          handleCancel={() =>
            setConfigModal({
              visible: false,
              data: null,
              type: null
            })
          }
          isSubmit={false}
          visible={configModal.visible}
        />
      )}
    </div>
  );
};

export default requireAuthentication(TransportCompanyPaymentPage, [ROLES.TRANSPORT_COMPANY]);
