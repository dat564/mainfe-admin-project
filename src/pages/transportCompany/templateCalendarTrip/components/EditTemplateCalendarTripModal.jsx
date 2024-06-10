import { ModalForm, ProFormText, ProTable } from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import { NOTIFY_MESSAGE } from 'constants';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { getUserList } from 'services';
import { createCompanyPayment } from 'services/companyPayment';

const EditTemplateCalendarTripModal = ({ handleReload, data, visible, onClose }) => {
  const formRef = useRef();
  const columns = [];
  const [dataSource, setDataSource] = React.useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  useEffect(() => {
    if (!data?.id) return;
    getUserList({ id: data.id })
      .then((res) => {
        const [_data] = res.data.data;
        formRef.current.setFieldsValue({
          ..._data
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
          await createCompanyPayment([
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
          <ProFormText name="name" showSearch label="Tên mẫu" />
        </Col>
        <Col span={24}>
          <ProTable
            columns={columns}
            dataSource={dataSource}
            bordered
            search={false}
            rowSelection={{ selectedRowKeys, onChange: onSelectChange }}
          />
        </Col>
      </Row>
    </ModalForm>
  );
};

export default EditTemplateCalendarTripModal;
