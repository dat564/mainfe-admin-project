import { EditOutlined, SettingOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';
import Setting from 'components/svgs/Setting';
import Tabular from 'components/Tabular';
import { TICKET_STATUS_ENUM } from 'constants';
import EditTicketModal from 'pages/admin/trip/components/EditTicketModal';
import MultiEditTicketModal from 'pages/admin/trip/components/MultiEditTicketModal';
import React from 'react';
import { getTicketList } from 'services';
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

const Step4 = ({ trip }) => {
  console.log({ trip });
  const [loading, setLoading] = React.useState(false);
  const tableRef = React.useRef();

  const { getSelectedRowKeys, setSelectedRowKeys } = tableRef.current || {};

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

  const handleAfterMultiEdit = () => {
    setSelectedRowKeys([]);
    tableRef.current.reload();
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
      title: 'Tìm kiếm',
      dataIndex: 'name_or_code',
      hideInTable: true,
      key: 'name_or_code',
      renderFormCol: false
    },
    {
      title: 'Mã vé',
      dataIndex: 'code',
      search: false,
      key: 'code'
    },
    {
      title: 'Giá vé',
      dataIndex: 'price',
      key: 'price',
      search: false
    },
    {
      title: 'Số ghế',
      dataIndex: 'position_on_car',
      key: 'position_on_car',
      search: false,
      render: (_, record) => record?.position_on_car + 1
    },
    {
      title: 'Điểm thưởng',
      dataIndex: 'regular_point',
      key: 'regular_point',
      search: false
    },
    {
      title: 'Điểm xuất phát',
      dataIndex: 'route_start',
      key: 'route_start',
      search: false,
      valueType: 'select',
      render: (_, record) => record?.trip?.route_start
    },
    {
      title: 'Điểm đến',
      dataIndex: 'route_end',
      key: 'route_end',
      search: false,
      valueType: 'select',
      render: (_, record) => record?.trip?.route_end
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
            <h1 className="text-xl font-medium">Vé của chuyến</h1>

            <span
              className={`flex items-center justify-center p-3 transition-all bg-white border border-gray-200 rounded-md shadow-sm cursor-pointer hover:bg-gray-200`}
              onClick={() => onOpenModal(ModalType.MULTI_EDIT)}
            >
              <EditOutlined />
            </span>
          </div>
        }
        request={async (params) => {
          const { current, pageSize, purchase_time, ...rest } = params;
          const [startTime, endTime] = purchase_time || [];
          setLoading(true);
          const _params = {
            ...rest,
            per_size: pageSize,
            page: current,
            start_time: convertDatetimeToServer(startTime),
            end_time: convertDatetimeToServer(endTime),
            trip_id: trip?.id
          };

          const res = await getTicketList(_params);
          setLoading(false);
          return {
            data: res.data.data,
            success: true,
            total: res.data.total
          };
        }}
        scroll={{ y: 300 }}
        loading={loading}
        options={false}
      />
      {configModal.type === ModalType.EDIT && (
        <EditTicketModal
          handleReload={() => tableRef.current.reload()}
          visible
          onClose={onCloseModal}
          data={configModal.data}
        />
      )}

      {configModal.type === ModalType.MULTI_EDIT && (
        <MultiEditTicketModal
          handleReload={() => tableRef.current.reload()}
          visible
          selectedRowKeys={getSelectedRowKeys()}
          onClose={onCloseModal}
          handleAfterMultiEdit={handleAfterMultiEdit}
        />
      )}
    </>
  );
};

export default Step4;
