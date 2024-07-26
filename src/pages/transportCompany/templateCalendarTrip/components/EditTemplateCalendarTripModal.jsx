import { ModalForm, ProFormText, ProTable } from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import { NOTIFY_MESSAGE } from 'constants';
import AddTemplateTrip from 'pages/transportCompany/templateCalendarTrip/components/AddTemplateTrip';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { getTripListV2 } from 'services';
import { updateTemplateCalendarTrip } from 'services/templateCalendarTrip';
import { convertDateAndFormat } from 'utils/date';

const EditTemplateCalendarTripModal = ({ handleReload, data, visible, onClose }) => {
  const formRef = useRef();
  const actionRef = useRef();
  const columns = [
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
      title: 'Thời gian đi',
      dataIndex: 'departure_time',
      key: 'departure_time',
      render: (_, record) => convertDateAndFormat(record.departure_time)
    },
    {
      title: 'Thời gian đến',
      dataIndex: 'scheduled_end_time',
      key: 'scheduled_end_time',
      render: (_, record) => convertDateAndFormat(record.scheduled_end_time)
    }
  ];
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  useEffect(() => {
    if (data?.trip_ids) setSelectedRowKeys(data?.trip_ids);
  }, [data?.trip_ids]);

  return (
    <ModalForm
      title="Sửa mẫu lịch trình"
      width="70%"
      open={visible}
      autoFocusFirstInput
      modalProps={{
        onCancel: () => onClose(),
        destroyOnClose: true
      }}
      initialValues={data}
      onFinish={async (values) => {
        try {
          await updateTemplateCalendarTrip([
            {
              ...values,
              id: data.id,
              trip_ids: selectedRowKeys
            }
          ]);
          toast.success(NOTIFY_MESSAGE.UPDATE_SUCCESS);
          onClose();
          handleReload();
          return true;
        } catch (err) {
          toast.error(err.response.data.message);
        }
      }}
      formRef={formRef}
      className="px-10 py-5"
    >
      <Row gutter={[30, 20]}>
        <Col span={12}>
          <ProFormText name="name" label="Tên mẫu" rules={[{ required: true, message: 'Vui lòng nhập trường này' }]} />
        </Col>
        <Col span={24}>
          <ProTable
            actionRef={actionRef}
            columns={columns}
            loading={loading}
            bordered
            search={false}
            headerTitle={
              <div>
                <div className="flex items-center w-full gap-4">
                  <h1 className="text-xl font-medium">Các chuyến hiện tại</h1>
                  <AddTemplateTrip handleReload={() => actionRef?.current?.reload()} />
                </div>
              </div>
            }
            request={async (params) => {
              setLoading(true);
              const _params = {
                ...params,
                per_size: params.pageSize,
                page: params.current,
                start_time: params?.dateRange && params.dateRange[0],
                end_time: params?.dateRange && params.dateRange[1]
              };

              const res = await getTripListV2(_params);
              setLoading(false);
              return {
                data: res.data.data,
                success: true,
                total: res.data.total
              };
            }}
            rowKey={(e) => e.id}
            rowSelection={{ selectedRowKeys, onChange: onSelectChange }}
          />
        </Col>
      </Row>
    </ModalForm>
  );
};

export default EditTemplateCalendarTripModal;
