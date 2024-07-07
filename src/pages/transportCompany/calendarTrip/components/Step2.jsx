import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
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
import Setting from 'components/svgs/Setting';
import { operatorColumnRender } from 'utils/columns';

const Step2 = forwardRef(({ setTemplateId, data }, ref) => {
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState();

  const tableRef = useRef();
  const { getSelectedRowKeys, setSelectedRowKeys, reload: reloadTable } = tableRef.current || {};

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
      const checkedList = getSelectedRowKeys();
      if (checkedList.length <= 0) {
        toast.error('Vui lòng chọn ít nhất 1 mẫu để xóa!');
        return;
      }
      await multiDeleteTemplateCalendarTrip({ ids: getSelectedRowKeys() });
      reloadTable();
      toast.success('Xóa thành công!');
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  function handleEdit(record) {
    setShowEditModal(true);
    setSelectedRow(record);
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
      title: 'Tên mẫu',
      dataIndex: 'name',
      key: 'name',
      renderFormCol: false
    }
  ];

  const onCloseEditModal = () => {
    setSelectedRow({});
    setShowEditModal(false);
  };

  useEffect(() => {
    if (data && setSelectedRowKeys) {
      setSelectedRowKeys([data.template_id]);
    }
  }, [data, setSelectedRowKeys]);

  useImperativeHandle(
    ref,
    () => ({
      selectedRowKeys: getSelectedRowKeys(),
      selectedRow
    }),
    [getSelectedRowKeys, selectedRow]
  );

  return (
    <div className="px-5 mt-10 ">
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
        rowSelectionType="radio"
        customOnSelectChange={(template_ids) => {
          setTemplateId(template_ids[0]);
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
});

export default requireAuthentication(Step2, [ROLES.TRANSPORT_COMPANY]);
