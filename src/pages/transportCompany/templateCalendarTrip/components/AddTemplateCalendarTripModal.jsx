import { FolderAddOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText, ProTable } from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import { NOTIFY_MESSAGE } from 'constants';
import React, { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { updateTrip } from 'services';
import { getTripList } from 'services';
import { createCompanyPayment } from 'services/companyPayment';
import { createTemplateCalendarTrip } from 'services/templateCalendarTrip';
import { formatTime } from 'utils';

const AddTemplateCalendarTripModal = ({ handleReload }) => {
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
  const [loading, setLoading] = React.useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  return (
    <ModalForm
      title="Thêm mẫu lịch trình"
      width="70%"
      autoFocusFirstInput
      trigger={
        <span className="flex items-center justify-center p-3 transition-all bg-white border border-gray-200 rounded-md shadow-sm cursor-pointer hover:bg-gray-200">
          <FolderAddOutlined />
        </span>
      }
      modalProps={{
        onCancel: () => {
          setSelectedRowKeys([]);
          return true;
        },
        destroyOnClose: true
      }}
      onFinish={async (values) => {
        try {
          await createTemplateCalendarTrip([
            {
              ...values,
              trip_ids: selectedRowKeys
            }
          ]);
          toast.success(NOTIFY_MESSAGE.ADD_SUCCESS);
          handleReload();
          setSelectedRowKeys([]);
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
          <ProFormText
            name="name"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập trường này'
              }
            ]}
            showSearch
            label="Tên mẫu"
          />
        </Col>
        <Col span={24}>
          <ProTable
            loading={loading}
            columns={columns}
            rowKey={(record) => record.id}
            dataSource={dataSource}
            headerTitle={<h1 className="mt-10 mb-2 text-xl font-medium">Các chuyến hiện tại</h1>}
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
            bordered
            search={true}
            rowSelection={{ selectedRowKeys, onChange: onSelectChange }}
          />
        </Col>
      </Row>
    </ModalForm>
  );
};

export default AddTemplateCalendarTripModal;
