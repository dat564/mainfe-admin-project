import { ModalForm, ProFormDateTimePicker, ProFormMoney, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import { NOTIFY_MESSAGE } from 'constants';
import moment from 'moment';
import React, { useRef } from 'react';
import { toast } from 'react-toastify';
import { updateBreakpoint } from 'services/breakpoint';
import { getCityList } from 'services/cities';
import { convertDatetimeToServer } from 'utils/date';
import { convertDatetime } from 'utils/date';

const EditBreakPointModal = ({ trip, visible, handleReload, onClose, data }) => {
  const formRef = useRef();

  const handleGetCityList = async () => {
    try {
      const res = await getCityList();
      const { results } = res?.data;
      return results.map((item) => ({ label: item.province_name, value: item.province_name }));
    } catch (error) {}
  };

  return (
    <ModalForm
      title="Sửa điểm dừng"
      width="60%"
      open={visible}
      autoFocusFirstInput
      modalProps={{
        onCancel: onClose,
        destroyOnClose: true
      }}
      initialValues={{
        ...data,
        scheduled_end_time: data.scheduled_end_time ? convertDatetime(data.scheduled_end_time) : null
      }}
      onFinish={async (values) => {
        try {
          const body = [
            {
              ...values,
              trip_id: trip.id,
              scheduled_end_time: convertDatetimeToServer(values.scheduled_end_time),
              id: data.id
            }
          ];
          await updateBreakpoint(body);
          handleReload && handleReload();

          onClose && onClose();
          toast.success(NOTIFY_MESSAGE.UPDATE_SUCCESS);
          return true;
        } catch (err) {}
      }}
      formRef={formRef}
      className="p-10"
    >
      <Row gutter={[40, 20]}>
        <Col span={12}>
          <ProFormSelect
            name="name"
            showSearch
            label="Tuyến đến"
            request={handleGetCityList}
            rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
          />
        </Col>
        <Col span={12}>
          <ProFormMoney name="price" label="Giá vé" rules={[{ required: true, message: 'Vui lòng nhập trường này' }]} />
        </Col>
        <Col span={12}>
          <ProFormDateTimePicker
            name="scheduled_end_time"
            rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
            fieldProps={{
              // disable những thời gian ngoài khoản departure_time và scheduled_end_time
              disabledDate: (current) => {
                if (!trip?.departure_time || !trip?.scheduled_end_time) return false;

                const departureTime = moment(convertDatetime(trip.departure_time)).startOf('day');
                const scheduledEndTime = moment(convertDatetime(trip.scheduled_end_time)).endOf('day');

                return current && (current < departureTime || current > scheduledEndTime);
              },
              disabledTime: (current) => {
                if (!current) return false;

                const departureTime = moment(convertDatetime(trip.departure_time));
                const scheduledEndTime = moment(convertDatetime(trip.scheduled_end_time));

                if (current.isSame(departureTime, 'day')) {
                  return {
                    disabledHours: () => [...Array(departureTime.hours()).keys()],
                    disabledMinutes: (hour) =>
                      hour === departureTime.hours() ? [...Array(departureTime.minutes()).keys()] : [],
                    disabledSeconds: (hour, minute) =>
                      hour === departureTime.hours() && minute === departureTime.minutes()
                        ? [...Array(departureTime.seconds()).keys()]
                        : []
                  };
                }

                if (current.isSame(scheduledEndTime, 'day')) {
                  return {
                    disabledHours: () => [...Array(24).keys()].filter((h) => h > scheduledEndTime.hours()),
                    disabledMinutes: (hour) =>
                      hour === scheduledEndTime.hours()
                        ? [...Array(60).keys()].filter((m) => m > scheduledEndTime.minutes())
                        : [],
                    disabledSeconds: (hour, minute) =>
                      hour === scheduledEndTime.hours() && minute === scheduledEndTime.minutes()
                        ? [...Array(60).keys()].filter((s) => s > scheduledEndTime.seconds())
                        : []
                  };
                }

                return false;
              },
              format: 'DD/MM/YYYY HH:mm:ss'
            }}
            label="Thời gian đến"
          ></ProFormDateTimePicker>
        </Col>
        {trip?.static_end_point && (
          <Col span={12}>
            <ProFormText
              name="end_point"
              label="Điểm trả"
              rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
            />
          </Col>
        )}
      </Row>
    </ModalForm>
  );
};

export default EditBreakPointModal;
