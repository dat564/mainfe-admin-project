import { ModalForm, ProFormSwitch, ProFormText } from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import Tabular from 'components/Tabular';
import { NOTIFY_MESSAGE } from 'constants';
import React, { useMemo, useRef } from 'react';
import { toast } from 'react-toastify';
import { getDriverList } from 'services';
import { createReconciled } from 'services/reconciled';
import { formatTime } from 'utils';

const AddReconciledModal = ({ handleReload, visible, handleCancel, data }) => {
  console.log({ data });
  const transport_company = useMemo(() => data?.transport_company, [data]);
  const trips = useMemo(() => data?.trips, [data]);

  console.log({ trips });
  console.log('transport_company', transport_company);
  const formRef = useRef();
  const tableRef = useRef();

  const handleGetDriverList = async () => {
    try {
      const res = await getDriverList({
        transport_company_id: transport_company?.id
      });
      const { data } = res?.data;
      console.log({ driver: data });
      return data.map((item) => ({ label: item.name, value: item.id }));
    } catch (error) {
      console.log({ error });
    }
  };

  const columns = [
    {
      title: 'Mã chuyến đi',
      dataIndex: 'code',
      key: 'code'
    },
    {
      title: 'Thời gian khởi hành',
      dataIndex: 'departure_time',
      hideInSearch: true,
      key: 'departure_time',
      render: (_, record) => formatTime(record.scheduled_end_time)
    },
    {
      title: 'Thời gian kết thúc',
      dataIndex: 'scheduled_end_time',
      key: 'scheduled_end_time',
      render: (_, record) => formatTime(record.scheduled_end_time),
      hideInSearch: true
    },
    {
      title: 'Điểm xuất phát',
      dataIndex: 'route_start',
      key: 'route_start'
    },
    {
      title: 'Điểm đến',
      dataIndex: 'route_end',
      key: 'route_end'
    }
  ];

  return (
    <ModalForm
      title="Thêm đối soát"
      width="70%"
      open={visible}
      autoFocusFirstInput
      modalProps={{
        onCancel: handleCancel,
        destroyOnClose: true
      }}
      onFinish={async () => {
        await createReconciled([
          {
            transport_company_id: transport_company?.id,
            trip_id: trips.map((e) => e.id)
          }
        ]);
        toast.success(NOTIFY_MESSAGE.ADD_SUCCESS);
        handleReload();
        handleCancel();
        return true;
      }}
      formRef={formRef}
      className="px-10 py-5"
    >
      <Row gutter={[30, 20]}>
        <Col span={12}>
          <ProFormText
            disabled
            label="Nhà xe"
            fieldProps={{
              value: transport_company?.name
            }}
          />
        </Col>
        <Col span={24}>
          <Tabular ref={tableRef} columns={columns} dataSource={trips} search={false} bordered rowKey={(e) => e.id} />
        </Col>
      </Row>
    </ModalForm>
  );
};

export default AddReconciledModal;
