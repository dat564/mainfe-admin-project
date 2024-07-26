import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormDigit, ProFormText } from '@ant-design/pro-components';
import { Col, Modal, Row, Upload } from 'antd';
import Tabular from 'components/Tabular';
import { image_url } from 'configs/images';
import { NOTIFY_MESSAGE } from 'constants';
import useUploadImage from 'hooks/useUploadImage';
import React, { useEffect, useMemo, useRef } from 'react';
import { toast } from 'react-toastify';
import { createReconciled } from 'services/reconciled';
import { formatTime } from 'utils';

const AddReconciledModal = ({ handleReload, visible, handleCancel, data, isHasCheckbox }) => {
  const transport_company = useMemo(() => data?.transport_company, [data]);
  const transport_company_payment = useMemo(
    () => transport_company?.transport_company_payment?.[0],
    [transport_company]
  );

  const trips = useMemo(() => data?.trips, [data]);
  console.log('trips', trips);
  const { previewImageModal, fileList, handlePreview, handleChange, handleCancelPreview, setFileList } =
    useUploadImage();

  const formRef = useRef();
  const tableRef = useRef();

  const columns = [
    {
      title: 'Mã chuyến đi',
      dataIndex: 'code',
      key: 'code'
    },
    {
      title: 'Thời gian khởi hành',
      dataIndex: 'departure_time',
      hideInSearch: true,
      key: 'departure_time',
      render: (_, record) => formatTime(record.scheduled_end_time)
    },
    {
      title: 'Thời gian kết thúc',
      dataIndex: 'scheduled_end_time',
      key: 'scheduled_end_time',
      render: (_, record) => formatTime(record.scheduled_end_time),
      hideInSearch: true
    },
    {
      title: 'Điểm xuất phát',
      dataIndex: 'route_start',
      key: 'route_start'
    },
    {
      title: 'Điểm đến',
      dataIndex: 'route_end',
      key: 'route_end'
    }
  ];

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  useEffect(() => {
    if (!transport_company_payment && !formRef.current) return;
    if (transport_company_payment?.image_qr_code) {
      setFileList([
        {
          name: 'image.png',
          status: 'done',
          url: image_url + transport_company_payment?.image_qr_code
        }
      ]);
    }
  }, [transport_company_payment, setFileList]);

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
      onFinish={async () => {
        await createReconciled([
          {
            transport_company_id: transport_company?.id,
            trip_id: trips.map((e) => e.id)
          }
        ]);
        toast.success(NOTIFY_MESSAGE.ADD_SUCCESS);
        handleReload && handleReload();
        handleCancel();
        return true;
      }}
      formRef={formRef}
      className="px-10 py-5"
    >
      <Row gutter={[30, 20]}>
        <Col span={12}>
          <Upload
            action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            beforeUpload={() => false} // Ngăn người dùng chọn nhiều file
          >
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>
        </Col>
        <Col span={12}>
          <ProFormText
            disabled
            label="Nhà xe"
            fieldProps={{
              value: transport_company?.name
            }}
          />
        </Col>
        <Col span={12}>
          <ProFormText
            disabled
            label="Tên tài khoản"
            fieldProps={{
              value: transport_company_payment?.name_bank
            }}
          />
        </Col>
        <Col span={12}>
          <ProFormDigit
            disabled
            label="Số tài khoản"
            fieldProps={{
              value: transport_company_payment?.number_bank
            }}
          />
        </Col>
        <Col span={24}>
          <Tabular
            ref={tableRef}
            columns={columns}
            dataSource={trips}
            search={false}
            bordered
            rowKey={(e) => e.id}
            isHasCheckbox={!!transport_company_payment}
          />
        </Col>
      </Row>
      <Modal open={previewImageModal.open} title={previewImageModal.title} footer={null} onCancel={handleCancelPreview}>
        <img alt="example" style={{ width: '100%' }} src={previewImageModal.image} />
      </Modal>
    </ModalForm>
  );
};

export default AddReconciledModal;
