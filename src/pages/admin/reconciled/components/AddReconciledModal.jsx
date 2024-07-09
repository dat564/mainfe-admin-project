import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import Tabular from 'components/Tabular';
import { NOTIFY_MESSAGE } from 'constants';
import React, { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { getDetailReconciled } from 'services/reconciled';
import { createReconciled } from 'services/reconciled';

const AddReconciledModal = ({ handleReload, visible, handleCancel, transport_company }) => {
  const formRef = useRef();
  const tableRef = useRef();
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: 'Số tiền chưa đối soát',
      dataIndex: 'unreconciled_amount',
      search: false,
      key: 'unreconciled_amount'
    },
    {
      title: 'Tổng số tiền đã đối soát',
      dataIndex: 'total_reconciled_amount',
      search: false,
      key: 'total_reconciled_amount'
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
      onFinish={async (values) => {
        try {
          await createReconciled([
            {
              ...values
            }
          ]);
          toast.success(NOTIFY_MESSAGE.ADD_SUCCESS);
          handleReload();
          handleCancel();
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
            disabled
            label="Nhà xe"
            rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
          ></ProFormText>
        </Col>
        <Col span={24}>
          <Tabular
            ref={tableRef}
            columns={columns}
            search={false}
            bordered
            rowKey={(e) => e.id}
            request={async (params) => {
              setLoading(true);
              const cloneParams = {
                ...params,
                transport_company_id: transport_company?.id
              };
              const res = await getDetailReconciled(cloneParams);
              setLoading(false);
              return {
                data: res.data.data,
                success: true
              };
            }}
            rowSelection={{}}
            headerTitle={
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-medium">Quản lý thông tin đối soát</h1>
              </div>
            }
            loading={loading}
            options={{
              reload: () => {
                setLoading(true);
                tableRef.current.reset();
                setTimeout(() => {
                  setLoading(false);
                }, 1000);
              }
            }}
          />
        </Col>
      </Row>
    </ModalForm>
  );
};

export default AddReconciledModal;
