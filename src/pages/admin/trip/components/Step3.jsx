import { DeleteOutlined, EditOutlined, QuestionCircleOutlined, SettingOutlined } from '@ant-design/icons';
import { Dropdown, Popconfirm } from 'antd';
import Setting from 'components/svgs/Setting';
import Tabular from 'components/Tabular';
import AddBreakPointModal from 'pages/admin/trip/components/AddBreakPointModal';
import EditBreakPointModal from 'pages/admin/trip/components/EditBreakPointModal';
import EditTicketModal from 'pages/admin/trip/components/EditTicketModal';
import MultiEditTicketModal from 'pages/admin/trip/components/MultiEditTicketModal';
import React from 'react';
import { getTicketList } from 'services';
import { getBreakpointList } from 'services/breakpoint';
import { multiDeleteBreakpoint } from 'services/breakpoint';
import { convertDateAndFormat } from 'utils/date';
import { convertDatetimeToServer } from 'utils/date';

const ModalType = {
  EDIT: 'EDIT',
  MULTI_EDIT: 'MULTI_EDIT'
};

const items = [
  {
    key: 'edit',
    label: 'Chỉnh sửa'
  }
];

const Step3 = ({ trip }) => {
  const [loading, setLoading] = React.useState(false);
  const tableRef = React.useRef();

  const { getSelectedRowKeys, setSelectedRowKeys, reload: reloadTable } = tableRef.current || {};

  const [configModal, setConfigModal] = React.useState({
    data: null,
    type: null
  });

  const onCloseModal = () => {
    setConfigModal({ data: null, type: null });
  };

  const onOpenModal = (type, data) => {
    setConfigModal({ data, type });
  };

  const handleMultiDelete = async () => {
    const selectedRowKeys = getSelectedRowKeys();
    if (selectedRowKeys.length === 0) return;
    try {
      setLoading(true);
      await multiDeleteBreakpoint({ ids: selectedRowKeys });
      setSelectedRowKeys([]);
      reloadTable();
    } catch (error) {
      console.log({ error });
    }
    setLoading(false);
  };

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
                  case 'edit':
                    onOpenModal(ModalType.EDIT, record);
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
      title: 'Tỉnh thành',
      dataIndex: 'name',
      search: false,
      key: 'name'
    },
    {
      title: 'Giá vé',
      dataIndex: 'price',
      search: false,
      key: 'price'
    },
    {
      title: 'Điểm trả',
      dataIndex: 'end_point',
      search: false,
      key: 'end_point'
    },
    {
      title: 'Thời gian đến',
      dataIndex: 'scheduled_end_time',
      search: false,
      key: 'scheduled_end_time',
      render: (text) => convertDateAndFormat(text)
    }
  ];

  return (
    <>
      <Tabular
        ref={tableRef}
        columns={columns}
        rowKey={(e) => e.id}
        headerTitle={
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-medium">Điểm dừng của chuyến {trip.code}</h1>
            <AddBreakPointModal handleReload={reloadTable} trip={trip} />
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
        request={async (params) => {
          if (!trip?.id) return { data: [], success: true, total: 0 };
          const { current, pageSize, ...rest } = params;
          setLoading(true);
          const _params = {
            ...rest,
            per_size: pageSize,
            page: current,
            trip_id: trip.id
          };

          const res = await getBreakpointList(_params);
          setLoading(false);
          return {
            data: res.data.data,
            success: true,
            total: res.data.total
          };
        }}
        params={[trip.id]}
        scroll={{ y: 300 }}
        loading={loading}
        // options={false}
      />
      {configModal.type === ModalType.EDIT && (
        <EditBreakPointModal
          handleReload={() => tableRef.current.reload()}
          visible
          onClose={onCloseModal}
          data={configModal.data}
          trip={trip}
        />
      )}
    </>
  );
};

export default Step3;
