import { FolderAddOutlined, PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormDigit, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { Col, Modal, Row, Upload } from 'antd';
import { ROLES } from 'constants';
import { NOTIFY_MESSAGE } from 'constants';
import useUploadImage from 'hooks/useUploadImage';
import React, { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { getUserList } from 'services';
import { createCompanyPayment } from 'services/companyPayment';
import { getPaymentList } from 'services/payment';

const EditPaymentModal = ({ handleReload, data, visible, onClose }) => {
  const formRef = useRef();
  const {
    previewImageModal,
    fileList,
    handlePreview,
    handleChange,
    handleCancelPreview,
    setFileList,
    setPreviewImageModal
  } = useUploadImage();

  const handleGetPaymentList = async () => {
    try {
      const res = await getPaymentList();
      return res.data.data.map((item) => ({
        label: item.name,
        value: item.id
      }));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleGetTransportCompanyList = async () => {
    try {
      const res = await getUserList({ role: ROLES.TRANSPORT_COMPANY });
      return res.data.data.map((item) => ({
        label: item?.transport_company?.name,
        value: item?.transport_company?.id
      }));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (!data?.id) return;
    getUserList({ id: data.id })
      .then((res) => {
        const [_data] = res.data.data;
        if (_data?.img_url) {
          setPreviewImageModal((prev) => ({
            ...prev,
            image: _data?.img_url
          }));
          setFileList([
            {
              name: 'image.png',
              status: 'done',
              url: _data?.img_url
            }
          ]);
        }
        formRef.current.setFieldsValue({
          ..._data
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [data.id, setFileList, setPreviewImageModal]);

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Tải lên</div>
    </div>
  );

  return (
    <ModalForm
      title="Thêm phương thức thanh toán"
      width="50%"
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
          <ProFormText name="name_bank" showSearch label="Tên số tài khoản" />
        </Col>
        <Col span={12}>
          <ProFormDigit name="number_bank" showSearch label="Số tài khoản" />
        </Col>
        <Col span={12}>
          <ProFormSelect
            name="payment_id"
            showSearch
            request={handleGetPaymentList}
            label="Phương thức thanh toán"
            rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
          />
        </Col>
        <Col span={12}>
          <h1 className="mb-2">Ảnh</h1>
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
      </Row>
      <Modal open={previewImageModal.open} title={previewImageModal.title} footer={null} onCancel={handleCancelPreview}>
        <img alt="example" style={{ width: '100%' }} src={previewImageModal.image} />
      </Modal>
    </ModalForm>
  );
};

export default EditPaymentModal;
