import { DeleteOutlined, FolderAddOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText, ProTable } from '@ant-design/pro-components';
import { Col, Popconfirm, Row } from 'antd';
import { NOTIFY_MESSAGE } from 'constants';
import AddTrip from 'pages/admin/trip/components/AddTrip';
import AddTemplateTrip from 'pages/transportCompany/templateCalendarTrip/components/AddTemplateTrip';
import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getTripList } from 'services';
import { createTemplateCalendarTrip } from 'services/templateCalendarTrip';
import { convertDateAndFormat } from 'utils/date';

const AddTemplateCalendarTripModal = ({ handleReload }) => {
  const formRef = useRef();
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
      dataIndex: 'price_static',
      key: 'price_static',
      title: 'Giá cố định',
      render: (_, record) => record?.tickets?.[0]?.price
    },
    {
      title: 'Xe',
      dataIndex: 'car_id',
      key: 'car_id',
      render: (_, record) => record?.car?.name
    },
    {
      title: 'Tài xế',
      dataIndex: 'driver_id',
      key: 'driver_id',
      render: (_, record) => record?.driver?.user?.name
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
  const [dataSource, setDataSource] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const { transport_company } = useSelector((state) => state.auth.userInfo) || {};

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
              trip_ids: selectedRowKeys,
              transport_company_id: transport_company?.id
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
            headerTitle={
              <div>
                <div className="flex items-center w-full gap-4">
                  <h1 className="text-xl font-medium">Các chuyến hiện tại</h1>
                  <AddTemplateTrip />
                </div>
              </div>
            }
            search={false}
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
            rowSelection={{ selectedRowKeys, onChange: onSelectChange, hideDefaultSelections: true }}
          />
        </Col>
      </Row>
    </ModalForm>
  );
};

export default AddTemplateCalendarTripModal;
