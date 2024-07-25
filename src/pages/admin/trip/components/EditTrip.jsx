import { DeleteOutlined, QuestionCircleOutlined, SettingOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProFormDateTimeRangePicker,
  ProFormMoney,
  ProFormSelect,
  ProFormSwitch,
  ProFormText
} from '@ant-design/pro-components';
import { Col, Dropdown, Popconfirm, Row } from 'antd';
import Setting from 'components/svgs/Setting';
import Tabular from 'components/Tabular';
import { NOTIFY_MESSAGE } from 'constants';
import { CITIES } from 'constants';
import { ROLES } from 'constants';
import AddBreakPointModal from 'pages/admin/trip/components/AddBreakPointModal';
import EditBreakPointModal from 'pages/admin/trip/components/EditBreakPointModal';
import React, { useRef } from 'react';
import { toast } from 'react-toastify';
import { updateTrip } from 'services';
import { getUserList } from 'services';
import { getBreakpointList } from 'services/breakpoint';
import { multiDeleteBreakpoint } from 'services/breakpoint';
import { getCompanyPaymentList } from 'services/companyPayment';
import { convertDateAndFormat } from 'utils/date';
import { convertDatetimeToServer } from 'utils/date';
import { convertDatetime } from 'utils/date';

const ModalType = {
  EDIT: 'EDIT'
};

const items = [
  {
    key: 'edit',
    label: 'Chỉnh sửa'
  }
];

const EditTrip = ({ handleReload, data, visible, onClose, isTempUpdate = false }) => {
  const formRef = useRef();
  const [isStaticStartPoint, setIsStaticStartPoint] = React.useState(data.static_start_point);
  const [isStaticEndPoint, setIsStaticEndPoint] = React.useState(data.static_end_point);

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
      title: 'Điểm dừng',
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

  const handleGetDriver = async () => {
    try {
      const res = await getUserList({
        role: ROLES.DRIVER
      });
      const { data } = res?.data;
      return data.map((item) => ({ label: item.name, value: item?.driver?.id }));
    } catch (error) {
      console.log({ error });
    }
  };

  const handleGetCompanyPaymentList = async () => {
    try {
      const res = await getCompanyPaymentList({
        // transport_company_id: valuesRef.current?.transportCompanyId
      });
      const { data } = res?.data;
      return data.map((item) => ({ label: item.name_bank, value: item.id }));
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <ModalForm
      title="Sửa chuyến đi"
      width="60%"
      open={visible}
      autoFocusFirstInput
      modalProps={{
        onCancel: () => onClose(),
        destroyOnClose: true
      }}
      initialValues={{
        ...data,
        timeRage: [convertDatetime(data?.departure_time), convertDatetime(data?.scheduled_end_time)]
      }}
      onFinish={async (values) => {
        try {
          const body = {
            ...values,
            id: data.id,
            departure_time: convertDatetimeToServer(values.timeRage[0]),
            scheduled_end_time: convertDatetimeToServer(values.timeRage[1])
          };
          await updateTrip([body]);
          handleReload();
          onClose();
          toast.success(NOTIFY_MESSAGE.UPDATE_SUCCESS);
          return true;
        } catch (err) {}
      }}
      formRef={formRef}
      className="p-10"
    >
      <Row gutter={[30, 20]} className="h-[65vh] overflow-auto">
        <Col span={12}>
          <ProFormSelect
            name="route_start"
            showSearch
            label="Tuyến xuất phát"
            options={CITIES}
            rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
          />
        </Col>
        <Col span={12}>
          <ProFormSelect
            name="route_end"
            showSearch
            label="Tuyến đến"
            options={CITIES}
            rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
          />
        </Col>
        <Col span={12}>
          <ProFormDateTimeRangePicker
            name="timeRage"
            label="Thời gian xuất phát và kết thúc"
            fieldProps={{
              format: 'DD/MM/YYYY HH:mm:ss'
            }}
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập trường này'
              }
            ]}
          ></ProFormDateTimeRangePicker>
        </Col>
        <Col span={12}>
          <ProFormSelect
            name="driver_id"
            label="Tài xế"
            request={handleGetDriver}
            rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
          />
        </Col>
        <Col span={12}>
          <ProFormSwitch
            name="static_start_point"
            label="Đón cố định"
            fieldProps={{
              onChange: (value) => {
                setIsStaticStartPoint(value);
              }
            }}
          />
        </Col>
        <Col span={12}>
          <ProFormSwitch
            name="static_end_point"
            label="Trả cố định"
            fieldProps={{
              onChange: (value) => {
                setIsStaticEndPoint(value);
              }
            }}
          />
        </Col>
        <Col span={12}>
          <ProFormText
            name="start_point"
            showSearch
            label="Điểm xuất phát"
            disabled={!isStaticStartPoint}
            rules={[{ required: isStaticStartPoint, message: 'Vui lòng nhập trường này' }]}
          />
        </Col>
        <Col span={12}>
          <ProFormText
            name="end_point"
            showSearch
            label="Điểm đến"
            disabled={!isStaticEndPoint}
            rules={[{ required: isStaticEndPoint, message: 'Vui lòng nhập trường này' }]}
          />
        </Col>
        {isTempUpdate && (
          <Col span={12}>
            <ProFormSelect
              name="transport_company_payment_id"
              showSearch
              request={handleGetCompanyPaymentList}
              label="Phương thức thanh toán"
              rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
            />
          </Col>
        )}
        <Col span={24}>
          <Tabular
            ref={tableRef}
            columns={columns}
            rowKey={(e) => e.id}
            headerTitle={
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-medium">Điểm dừng của chuyến</h1>
                <AddBreakPointModal handleReload={reloadTable} trip={data} />
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
              const { current, pageSize, ...rest } = params;
              setLoading(true);
              const _params = {
                ...rest,
                per_size: pageSize,
                page: current,
                trip_id: data.id
              };

              const res = await getBreakpointList(_params);
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
            search={false}
          />
        </Col>
        {configModal.type === ModalType.EDIT && (
          <EditBreakPointModal
            handleReload={() => tableRef.current.reload()}
            visible
            onClose={onCloseModal}
            data={configModal.data}
            trip={data}
          />
        )}
      </Row>
    </ModalForm>
  );
};

export default EditTrip;
