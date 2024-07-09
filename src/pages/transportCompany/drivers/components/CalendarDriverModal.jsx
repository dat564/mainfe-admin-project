import { ModalForm } from '@ant-design/pro-components';
import { Tabs } from 'antd';
import Tabular from 'components/Tabular';
import React from 'react';
import { getTripList } from 'services';
import { formatTime } from 'utils';

const CalendarDriverModal = ({ open, handleClose, driver }) => {
  const tabs = [
    {
      label: 'Lịch trình tài xế',
      key: 'calendar_driver',
      children: <CalendarDriver driver={driver} />
    },
    {
      label: 'Các chuyến đã hoàn thành',
      key: 'completed_trip',
      children: <CompletedTrip driver={driver} />
    }
  ];

  return (
    <ModalForm
      title="Xem lịch trình tài xế"
      width="70%"
      open={open}
      autoFocusFirstInput
      modalProps={{
        onCancel: handleClose,
        destroyOnClose: true
      }}
      submitter={false}
      className="px-10 py-5"
    >
      <Tabs type="card" items={tabs}></Tabs>
    </ModalForm>
  );
};

const CalendarDriver = ({ driver }) => {
  const tableRef = React.useRef();
  const [loading, setLoading] = React.useState(false);

  const columns = [
    {
      title: 'Thời gian khởi hành',
      dataIndex: 'departure_time',
      hideInSearch: true,
      key: 'departure_time',
      render: (_, record) => formatTime(record.scheduled_end_time),
      renderFormCol: false
    },
    {
      title: 'Thời gian kết thúc',
      dataIndex: 'scheduled_end_time',
      key: 'scheduled_end_time',
      render: (_, record) => formatTime(record.scheduled_end_time),
      hideInSearch: true,
      renderFormCol: false
    },
    {
      title: 'Điểm xuất phát',
      dataIndex: 'route_start',
      key: 'route_start',
      renderFormCol: false
    },
    {
      title: 'Điểm đến',
      dataIndex: 'route_end',
      key: 'route_end',
      renderFormCol: false
    }
  ];
  return (
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
          page: params.current,
          driver_id: driver.id,
          start_time: params?.dateRange && params.dateRange[0],
          end_time: params?.dateRange && params.dateRange[1]
        };

        const res = await getTripList(_params);
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
      headerTitle="Lịch trình tài xế"
    />
  );
};

const CompletedTrip = ({ driver }) => {
  const tableRef = React.useRef();
  const [loading, setLoading] = React.useState(false);

  const columns = [
    {
      title: 'Thời gian khởi hành',
      dataIndex: 'departure_time',
      hideInSearch: true,
      key: 'departure_time',
      render: (_, record) => formatTime(record.scheduled_end_time),
      renderFormCol: false
    },
    {
      title: 'Thời gian kết thúc',
      dataIndex: 'scheduled_end_time',
      key: 'scheduled_end_time',
      render: (_, record) => formatTime(record.scheduled_end_time),
      hideInSearch: true,
      renderFormCol: false
    },
    {
      title: 'Điểm xuất phát',
      dataIndex: 'route_start',
      key: 'route_start',
      renderFormCol: false
    },
    {
      title: 'Điểm đến',
      dataIndex: 'route_end',
      key: 'route_end',
      renderFormCol: false
    }
  ];
  return (
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
          page: params.current,
          driver_id: driver.id,
          start_time: params?.dateRange && params.dateRange[0],
          end_time: params?.dateRange && params.dateRange[1]
        };

        const res = await getTripList(_params);
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
      headerTitle="Chuyến đã hoàn thành"
    />
  );
};

export default CalendarDriverModal;
