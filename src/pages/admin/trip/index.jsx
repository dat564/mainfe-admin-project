import React, { useRef, useState } from 'react';
import { DeleteOutlined, FolderAddOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { formatTime } from 'utils/utils';
import { Button, Form, Popconfirm } from 'antd';
import { toast } from 'react-toastify';
import EditTrip from './components/EditTrip';
import requireAuthentication from 'hoc/requireAuthentication';
import { ROLES } from 'constants';
import AddModal from './components/AddModal';
import { getTripList } from 'services/trip';
import { useSelector } from 'react-redux';
import Tabular from 'components/Tabular';
import { multiDeleteTrip } from 'services';
import { NOTIFY_MESSAGE } from 'constants';
import Setting from 'components/svgs/Setting';
import { operatorColumnRender } from 'utils/columns';
import { getDriverList } from 'services';
import { convertDateAndFormat, convertDatetimeToServer } from 'utils/date';
import TicketDetailModal from 'pages/admin/trip/components/TicketDetailModal';
import moment from 'moment';

const ModalType = {
  ADD: 'ADD',
  EDIT: 'EDIT',
  TICKET_DETAIL: 'TICKET_DETAIL'
};

const TripPage = () => {
  const [loading, setLoading] = useState(false);
  const { transport_company } = useSelector((state) => state.auth.userInfo) || {};
  const [configModal, setConfigModal] = useState({
    data: null,
    type: null
  });
  const [totalTrip, setTotaltrip] = useState(0);
  const tableRef = useRef();
  const [searchForm] = Form.useForm();
  const [dateRange, setDateRange] = useState([]);

  const { getSelectedRowKeys, setSelectedRowKeys } = tableRef.current || {};

  async function handleDelete(recordId) {
    try {
      setLoading(true);
      await multiDeleteTrip({ ids: [recordId] });
      setSelectedRowKeys([]);
      toast.success(NOTIFY_MESSAGE.DELETE_SUCCESS);
      handleReload();
    } catch (error) {
      toast.error(error.response.data.message);
    }
    setLoading(false);
  }

  function handleEdit(record) {
    openModal(ModalType.EDIT, record);
  }

  const handleGetDriverList = async () => {
    try {
      const res = await getDriverList({
        transport_company_id: transport_company?.id
      });
      const { data } = res?.data;
      return data.map((item) => ({ label: item.name, value: item.id }));
    } catch (error) {
      console.log({ error });
    }
  };

  const openModal = (type, data) => {
    setConfigModal({
      data,
      type
    });
  };

  const closeModal = () => {
    setConfigModal({
      data: null,
      type: null
    });
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
      render: (_, record) => operatorColumnRender({ record, handleDelete, handleEdit })
    },
    {
      title: 'Mã chuyến',
      dataIndex: 'code',
      key: 'code',
      render: (text, record) => (
        <Button type="link" onClick={() => openModal(ModalType.TICKET_DETAIL, record)}>
          {text}
        </Button>
      )
    },
    {
      title: 'Thời gian khởi hành',
      dataIndex: 'departure_time',
      hideInSearch: true,
      key: 'departure_time',
      render: (_, record) => convertDateAndFormat(record.departure_time)
    },
    {
      title: 'Thời gian kết thúc',
      dataIndex: 'scheduled_end_time',
      key: 'scheduled_end_time',
      render: (_, record) => convertDateAndFormat(record.scheduled_end_time),
      hideInSearch: true
    },
    {
      title: 'Tuyến đi',
      dataIndex: 'route_start',
      key: 'route_start'
    },
    {
      title: 'Tuyến đến',
      dataIndex: 'route_end',
      key: 'route_end'
    },
    {
      title: 'Tài xế',
      dataIndex: 'driver_id',
      key: 'driver_id',
      valueType: 'select',
      request: handleGetDriverList,
      render: (_, record) => record?.driver?.user?.name
    },
    {
      title: 'Khoảng thời gian',
      dataIndex: 'timeRange',
      key: 'timeRange',
      hideInTable: true,
      valueType: 'dateTimeRange',
      fieldProps: {
        format: 'DD/MM/YYYY HH:mm:ss'
      }
    }
  ];

  const handleReload = () => {
    tableRef.current.reload();
  };

  const handleMultiDelete = async () => {
    try {
      const checkedList = getSelectedRowKeys?.();
      if (!checkedList?.length) {
        toast.error('Vui lòng chọn ít nhất 1 bản ghi để xóa');
        return;
      }
      await multiDeleteTrip({ ids: getSelectedRowKeys() });
      handleReload();
      toast.success('Delete successfully!');
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  // lấy giờ đầu tiên và giờ cuối cùng của ngày hiện tại
  function handleSearchTripToday() {
    const startOfDay = moment().startOf('day');
    const endOfDay = moment().endOf('day');

    setDateRange([startOfDay, endOfDay]);
  }

  // lấy giờ đầu tiên và giờ cuối cùng của tuần hiện tại
  function handleSearchTripThisWeek() {
    const startOfWeek = moment().startOf('week');
    const endOfWeek = moment().endOf('week');

    setDateRange([startOfWeek, endOfWeek]);
  }

  // lấy giờ đầu tiên và giờ cuối cùng của tháng hiện tại
  function handleSearchTripThisMonth() {
    const startOfMonth = moment().startOf('month');
    const endOfMonth = moment().endOf('month');

    setDateRange([startOfMonth, endOfMonth]);
  }

  return (
    <div className="min-h-[100vh] px-5 mt-10">
      <Tabular
        ref={tableRef}
        loading={loading}
        columns={columns}
        rowKey={(e) => e.id}
        request={async (params) => {
          const { dateRange } = params;
          console.log({ dateRange, params });
          setLoading(true);
          delete params.dateRange;
          const _params = {
            ...params,
            transport_company_id: transport_company?.id,
            per_size: params.pageSize,
            page: params.current,
            departure_time:
              convertDatetimeToServer(params?.timeRange?.[0]) ||
              convertDatetimeToServer(dateRange?.[0]?.format('DD/MM/YYYY HH:mm:ss')),
            scheduled_end_time:
              convertDatetimeToServer(params?.timeRange?.[1]) ||
              convertDatetimeToServer(dateRange?.[1]?.format('DD/MM/YYYY HH:mm:ss'))
          };

          delete _params.timeRange;

          const res = await getTripList(_params);
          setLoading(false);
          setTotaltrip(res.data.total);
          return {
            data: res.data.data,
            success: true,
            total: res.data.total
          };
        }}
        form={{
          form: searchForm
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
        params={{
          dateRange
        }}
        headerTitle={
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-medium ">Quản lý chuyến ({totalTrip})</h1>
            <span
              className="flex items-center justify-center p-3 transition-all bg-white border border-gray-200 rounded-md shadow-sm cursor-pointer hover:bg-gray-200"
              onClick={() => openModal(ModalType.ADD)}
            >
              <FolderAddOutlined />
            </span>
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
            <Button onClick={handleSearchTripToday}>Chuyến hôm nay</Button>
            <Button onClick={handleSearchTripThisWeek}>Chuyến tuần này</Button>
            <Button onClick={handleSearchTripThisMonth}>Chuyến tháng này</Button>
          </div>
        }
      />
      {configModal.type === ModalType.EDIT && (
        <EditTrip handleReload={handleReload} visible onClose={() => closeModal()} data={configModal.data} />
      )}
      {configModal.type === ModalType.ADD && (
        <AddModal
          handleReload={handleReload}
          open
          handleCancel={() => closeModal()}
          companyId={transport_company?.id}
        />
      )}
      {configModal.type === ModalType.TICKET_DETAIL && (
        <TicketDetailModal open onCancel={closeModal} tripData={configModal.data} />
      )}
    </div>
  );
};

export default requireAuthentication(TripPage, [ROLES.TRANSPORT_COMPANY]);
