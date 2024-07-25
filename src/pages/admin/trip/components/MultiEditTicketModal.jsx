import { ModalForm, ProFormDigit, ProFormSelect, ProFormSwitch, ProFormText } from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import { TICKET_STATUS } from 'constants';
import { TICKET_STATUS_OPTIONS } from 'constants';
import { NOTIFY_MESSAGE } from 'constants';
import React, { useRef } from 'react';
import { toast } from 'react-toastify';
import { updateTicket } from 'services';
import { convertDatetimeToServer } from 'utils/date';

const MultiEditTicketModal = ({ handleReload, visible, onClose, handleAfterMultiEdit, selectedRowKeys }) => {
  const formRef = useRef();

  return (
    <ModalForm
      title="Sửa vé"
      width="70%"
      open={visible}
      autoFocusFirstInput
      modalProps={{
        onCancel: () => onClose(),
        destroyOnClose: true
      }}
      onFinish={async (values) => {
        try {
          const bodyData = selectedRowKeys.map((id) => {
            return {
              id,
              ...values
            };
          });

          await updateTicket(bodyData);
          toast.success(NOTIFY_MESSAGE.UPDATE_SUCCESS);
          onClose();
          handleAfterMultiEdit && handleAfterMultiEdit();
          handleReload();
          return true;
        } catch (err) {
          toast.error(err.response.data.message);
        }
      }}
      formRef={formRef}
      className="px-10 py-5"
    >
      <Row gutter={[30, 20]} className="mb-5">
        <Col span={12}>
          <ProFormDigit
            name="regular_point"
            label="Điểm thưởng"
            fieldProps={{
              formatter: (value) => {
                if (value === undefined || value === null) return '';
                return new Intl.NumberFormat('vi-VN').format(value);
              },
              parser: (value) => value.replace(/\./g, '') // Xóa bỏ dấu chấm khi phân tích ngược giá trị nhập
            }}
          />
        </Col>

        <Col span={12}>
          <ProFormSwitch
            name="on_voucher"
            label="Áp dụng voucher"
            style={{
              backgroundColor: 'red'
            }}
          />
        </Col>
      </Row>
    </ModalForm>
  );
};

export default MultiEditTicketModal;
