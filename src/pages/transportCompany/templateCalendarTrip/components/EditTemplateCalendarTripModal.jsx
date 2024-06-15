import { ModalForm, ProFormText, ProTable } from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import { NOTIFY_MESSAGE } from 'constants';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { getTripList } from 'services';
import { getTemplateCalendarTripList } from 'services/templateCalendarTrip';
import { updateTemplateCalendarTrip } from 'services/templateCalendarTrip';
import { formatTime } from 'utils';

const EditTemplateCalendarTripModal = ({ handleReload, data, visible, onClose }) => {
  const formRef = useRef();
  const columns = [
    {
      title: 'Điểm đi',
      dataIndex: 'start_point',
      key: 'start_point'
    },
    {
      title: 'Điểm đến',
      dataIndex: 'end_point',
      key: 'end_point'
    },
    {
      title: 'Thời gian đi',
      dataIndex: 'departure_time',
      key: 'departure_time',
      render: (_, record) => formatTime(record.departure_time)
    },
    {
      title: 'Thời gian đến',
      dataIndex: 'scheduled_end_time',
      key: 'scheduled_end_time',
      render: (_, record) => formatTime(record.scheduled_end_time)
    }
  ];
  const [dataSource, setDataSource] = React.useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  useEffect(() => {
    if (!data?.id) return;
    getTemplateCalendarTripList({ id: data.id })
      .then((res) => {
        const [data] = res.data.data;
        formRef.current.setFieldsValue({
          ...data
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [data.id]);

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
      onFinish={async (values) => {
        try {
          await updateTemplateCalendarTrip([
            {
              ...values
            }
          ]);
          toast.success(NOTIFY_MESSAGE.ADD_SUCCESS);
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
            columns={columns}
            dataSource={dataSource}
            loading={loading}
            bordered
            request={async (params) => {
              setLoading(true);
              const _params = {
                ...params,
                per_size: params.pageSize,
                page: params.current,
                start_time: params?.dateRange && params.dateRange[0],
                end_time: params?.dateRange && params.dateRange[1]
              };

              const res = await getTripList(_params);
              setLoading(false);
              setDataSource(res.data.data);
              return {
                data: res.data.data,
                success: true,
                total: res.data.total
              };
            }}
            search={true}
            rowSelection={{ selectedRowKeys, onChange: onSelectChange }}
          />
        </Col>
      </Row>
    </ModalForm>
  );
};

export default EditTemplateCalendarTripModal;
