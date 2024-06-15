import React, { useRef, useState } from 'react';
import { DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { ROLES } from 'constants';
import { Popconfirm } from 'antd';
import { toast } from 'react-toastify';
import { NOTIFY_MESSAGE } from 'constants';
import requireAuthentication from 'hoc/requireAuthentication';
import AddTemplateCalendarTripModal from 'pages/transportCompany/templateCalendarTrip/components/AddTemplateCalendarTripModal';
import { getTemplateCalendarTripList } from 'services/templateCalendarTrip';
import EditTemplateCalendarTripModal from 'pages/transportCompany/templateCalendarTrip/components/EditTemplateCalendarTripModal';
import { multiDeleteTemplateCalendarTrip } from 'services/templateCalendarTrip';
import Tabular from 'components/Tabular';
import { renderFormCol } from 'utils';

const TemplateCalendarTripPage = () => {
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState();

  const tableRef = useRef();
  const { selectedRowKeys, setSelectedRowKeys, reload: reloadTable } = tableRef.current || {};

  async function handleDelete(recordId) {
    try {
      setLoading(true);
      await multiDeleteTemplateCalendarTrip({ ids: [recordId] });
      toast.success(NOTIFY_MESSAGE.DELETE_SUCCESS);
      setSelectedRowKeys([]);
      reloadTable();
    } catch (error) {
      toast.error(error.response.data.message);
    }
    setLoading(false);
  }

  const handleMultiDelete = async () => {
    try {
      await multiDeleteTemplateCalendarTrip({ ids: selectedRowKeys });
      reloadTable();
      toast.success('Xóa thành công!');
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const columns = [
    {
      title: 'Tên mẫu',
      dataIndex: 'name',
      key: 'name',
      renderFormItem: renderFormCol
    }
  ];

  const onCloseEditModal = () => {
    setSelectedRow({});
    setShowEditModal(false);
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
            per_size: params.pageSize,
            page: params.current
          };
          const res = await getTemplateCalendarTripList(cloneParams);
          setLoading(false);
          return {
            data: res.data.data,
            success: true,
            total: res.data.total
          };
        }}
        headerTitle={
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-medium">Quản lý mẫu lịch trình</h1>
            <AddTemplateCalendarTripModal handleReload={reloadTable} />
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
        <EditTemplateCalendarTripModal
          visible={showEditModal}
          data={selectedRow}
          onClose={onCloseEditModal}
          handleReload={reloadTable}
        />
      )}
    </div>
  );
};

export default requireAuthentication(TemplateCalendarTripPage, [ROLES.TRANSPORT_COMPANY]);
