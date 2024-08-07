import { FolderAddOutlined, PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormDigit, ProFormSelect, ProFormSwitch, ProFormText } from '@ant-design/pro-components';
import { Col, Modal, Row, Upload } from 'antd';
import { ROLES } from 'constants';
import { NOTIFY_MESSAGE } from 'constants';
import useUploadImage from 'hooks/useUploadImage';
import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { createCompanyPayment } from 'services/companyPayment';
import { getPaymentList } from 'services/payment';

const AddPaymentModal = ({ handleReload }) => {
  const formRef = useRef();
  const {
    previewImageModal,
    fileList,
    handlePreview,
    handleChange,
    handleCancelPreview,
    handleImageUpload,
    setFileList
  } = useUploadImage();
  const { transport_company } = useSelector((state) => state.auth.userInfo) || {};

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
      trigger={
        <span className="flex items-center justify-center p-3 transition-all bg-white border border-gray-200 rounded-md shadow-sm cursor-pointer hover:bg-gray-200">
          <FolderAddOutlined />
        </span>
      }
      autoFocusFirstInput
      modalProps={{
        onCancel: () => {
          setFileList([]);
          return true;
        },
        destroyOnClose: true
      }}
      onFinish={async (values) => {
        try {
          const data = {
            ...values,
            transport_company_id: transport_company?.id,
            is_default: values.is_default || false
          };

          let uploadedImage;
          if (fileList.length > 0 && fileList[0].originFileObj) {
            uploadedImage = await handleImageUpload(fileList[0]);
          }

          if (uploadedImage) {
            data.image_qr_code = uploadedImage;
          }

          await createCompanyPayment([data]);
          toast.success(NOTIFY_MESSAGE.ADD_SUCCESS);
          setFileList([]);
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
          <ProFormText
            name="name_bank"
            showSearch
            label="Tên ngân hàng"
            rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
          />
        </Col>
        <Col span={12}>
          <ProFormDigit
            name="number_bank"
            showSearch
            label="Số tài khoản"
            rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
          />
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
          <ProFormSwitch name="is_default" label="Kích hoạt" />
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

export default AddPaymentModal;
