import React, { useRef, useState } from 'react';
import { DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { toast } from 'react-toastify';
import requireAuthentication from 'hoc/requireAuthentication';
import { ROLES } from 'constants';
import Tabular from 'components/Tabular';
import { NOTIFY_MESSAGE } from 'constants';
import Setting from 'components/svgs/Setting';
import { operatorColumnRender } from 'utils/columns';
import AddVoucherModal from 'pages/admin/vourcher/components/AddVoucherModal';
import EditVoucherModal from 'pages/admin/vourcher/components/EditVoucherModal';
import { getVoucherList, multiDeleteVoucher } from 'services/vourcher';
import { convertDateAndFormat } from 'utils/date';
import moment from 'moment';

const VoucherPage = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedInstance, setSelectedInstance] = useState(null);
  const [loading, setLoading] = useState(false);

  const tableRef = useRef();

  const { getSelectedRowKeys, setSelectedRowKeys, reload: reloadTable } = tableRef.current || {};

  async function handleDelete(recordId) {
    try {
      setLoading(true);
      await multiDeleteVoucher({ ids: [recordId] });
      setSelectedRowKeys([]);
      toast.success(NOTIFY_MESSAGE.DELETE_SUCCESS);
      reloadTable();
    } catch (error) {}
    setLoading(false);
  }

  function handleEdit(record) {
    setSelectedInstance(record);
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
      title: 'Mã phiếu',
      dataIndex: 'code',
      key: 'code'
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      search: false,
      key: 'quantity'
    },
    {
      title: 'Giá giảm',
      dataIndex: 'discount_price',
      key: 'discount_price',
      search: false
    },
    {
      title: 'Điểm cần đạt để nhận',
      dataIndex: 'regular_point_need',
      search: false,
      key: 'regular_point_need'
    },
    {
      title: 'Thời gian hết hạn',
      dataIndex: 'expired_at',
      search: false,
      key: 'expired_at',
      render: (text, record) => moment(record.expired_at).format('DD/MM/YYYY')
    }
  ];

  const handleMultiDelete = async () => {
    try {
      const checkedList = getSelectedRowKeys?.();
      if (!checkedList?.length) {
        toast.error('Vui lòng chọn ít nhất 1 bản ghi để xóa');
        return;
      }
      await multiDeleteVoucher({ ids: getSelectedRowKeys() });
      reloadTable();
      setSelectedRowKeys([]);
      toast.success('Delete successfully!');
    } catch (error) {}
  };

  return (
    <div className="min-h-[100vh] px-5 mt-10">
      <Tabular
        ref={tableRef}
        loading={loading}
        columns={columns}
        rowKey={(e) => e.id}
        request={async (params) => {
          setLoading(true);
          const _params = {
            ...params,
            per_size: params.pageSize,
            page: params.current
          };

          const res = await getVoucherList(_params);
          setLoading(false);
          return {
            data: res.data.data,
            success: true,
            total: res.data.total
          };
        }}
        options={{
          reload: () => {
            setLoading(true);
            tableRef.current.reset();
            setTimeout(() => {
              setLoading(false);
            }, 1000);
          }
        }}
        headerTitle={
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-medium ">Quản lý phiếu giảm giá</h1>
            <AddVoucherModal reloadTable={reloadTable} />
            <Popconfirm
              title="Xóa"
              description="Bạn có chắc muốn xóa?"
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
      />
      {showEditModal && (
        <EditVoucherModal
          reloadTable={reloadTable}
          show={showEditModal}
          data={selectedInstance}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
};

export default requireAuthentication(VoucherPage, [ROLES.ADMIN]);
