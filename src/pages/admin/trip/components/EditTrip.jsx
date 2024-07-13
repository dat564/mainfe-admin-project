import {
  ModalForm,
  ProFormDateTimeRangePicker,
  ProFormMoney,
  ProFormSelect,
  ProFormSwitch,
  ProFormText
} from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import { NOTIFY_MESSAGE } from 'constants';
import { CITIES } from 'constants';
import { ROLES } from 'constants';
import React, { useRef } from 'react';
import { toast } from 'react-toastify';
import { updateTrip } from 'services';
import { getUserList } from 'services';
import { getCompanyPaymentList } from 'services/companyPayment';
import { convertDatetimeToServer } from 'utils/date';
import { convertDatetime } from 'utils/date';

const EditTrip = ({ handleReload, data, visible, onClose, isTempUpdate = false }) => {
  const formRef = useRef();
  const [isStaticStartPoint, setIsStaticStartPoint] = React.useState(false);
  const [isStaticEndPoint, setIsStaticEndPoint] = React.useState(false);

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
          toast.success(NOTIFY_MESSAGE.UPDATE_SUCCESS);
          return true;
        } catch (err) {}
      }}
      formRef={formRef}
      className="p-10"
    >
      <Row gutter={[30, 20]}>
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
            label="Đón tận nơi"
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
            label="Trả tận nơi"
            fieldProps={{
              onChange: (value) => {
                setIsStaticEndPoint(value);
              }
            }}
          />
        </Col>
        <Col span={12}>
          <ProFormText name="start_point" showSearch label="Điểm xuất phát" disabled={!isStaticStartPoint} />
        </Col>
        <Col span={12}>
          <ProFormText name="end_point" showSearch label="Điểm đến" disabled={!isStaticEndPoint} />
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
        {/* <Col span={12}>
          <ProFormMoney
            name="price_static"
            label="Giá mặc định"
            // rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
          />
        </Col> */}
      </Row>
    </ModalForm>
  );
};

export default EditTrip;
