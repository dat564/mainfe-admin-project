import React, { useRef, useState } from 'react';
import { DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { ROLES } from 'constants';
import { Popconfirm } from 'antd';
import { toast } from 'react-toastify';
import { multipleDeleteUserById } from 'services';
import { NOTIFY_MESSAGE } from 'constants';
import requireAuthentication from 'hoc/requireAuthentication';
import AddPaymentModal from 'pages/transportCompany/payment/components/AddPaymentModal';
import EditPaymentModal from 'pages/transportCompany/payment/components/EditPaymentModal';
import { getCompanyPaymentList } from 'services/companyPayment';
import Tabular from 'components/Tabular';
import { renderFormCol } from 'utils';

const TransportCompanyPaymentPage = () => {
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState();

  const tableRef = useRef();

  const { selectedRowKeys, setSelectedRowKeys, reload: reloadTable } = tableRef.current || {};

  async function handleDelete(recordId) {
    try {
      setLoading(true);
      await multipleDeleteUserById({ ids: [recordId] });
      setSelectedRowKeys([]);
      toast.success(NOTIFY_MESSAGE.DELETE_SUCCESS);
      reloadTable();
    } catch (error) {
      toast.error(error.response.data.message);
    }
    setLoading(false);
  }

  const columns = [
    {
      title: 'Tên tài khoản',
      dataIndex: 'name_bank',
      key: 'name_bank',
      renderFormItem: renderFormCol
    },
    {
      title: 'Số tài khoản',
      dataIndex: 'number_bank',
      key: 'number_bank',
      renderFormItem: renderFormCol
    }
  ];

  const onCloseEditModal = () => {
    setSelectedRow({});
    setShowEditModal(false);
  };

  const handleMultiDelete = async () => {
    try {
      await multipleDeleteUserById({ ids: selectedRowKeys });
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
            ...params
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
            <h1 className="text-xl font-medium">Quản lý phương thức thanh toán</h1>
            <AddPaymentModal handleReload={reloadTable} />
            <Popconfirm
              title="Xóa"
              description="Bạn có chắc chấn muốn xóa?"
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
              onConfirm={handleMultiDelete}
              disabled={selectedRowKeys?.length <= 0}
            >
              <span
                className={`flex items-center justify-center p-3 transition-all bg-white border border-gray-200 rounded-md shadow-sm cursor-pointer hover:bg-gray-200 ${
                  selectedRowKeys?.length <= 0 ? 'cursor-not-allowed' : ''
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
        handleDelete={handleDelete}
        handleEdit={(record) => {
          setSelectedRow(record);
          setShowEditModal(true);
        }}
      />
      {showEditModal && (
        <EditPaymentModal
          show={showEditModal}
          data={selectedRow}
          onClose={onCloseEditModal}
          handleReload={reloadTable}
        />
      )}
    </div>
  );
};

export default requireAuthentication(TransportCompanyPaymentPage, [ROLES.TRANSPORT_COMPANY]);
