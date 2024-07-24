import { FolderAddOutlined, PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormDigit, ProFormText } from '@ant-design/pro-components';
import { Col, Modal, Row, Upload } from 'antd';
import { NOTIFY_MESSAGE } from 'constants';
import useUploadImage from 'hooks/useUploadImage';
import React from 'react';
import { toast } from 'react-toastify';
import { createCar } from 'services';

const AddCarModal = ({ companyId, handleReload }) => {
  const {
    previewImageModal,
    fileList,
    handlePreview,
    handleChange,
    handleCancelPreview,
    handleImageUpload,
    setFileList
  } = useUploadImage();

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <ModalForm
      title="Thêm xe"
      width="60%"
      trigger={
        <span className="flex items-center justify-center p-3 transition-all bg-white border border-gray-200 rounded-md shadow-sm cursor-pointer hover:bg-gray-200">
          <FolderAddOutlined />
        </span>
      }
      modalProps={{
        onCancel: () => {
          setFileList([]);
          return true;
        },
        destroyOnClose: true
      }}
      onFinish={async (values) => {
        try {
          let uploadedImage;
          if (fileList.length > 0 && fileList[0].originFileObj) {
            uploadedImage = await handleImageUpload(fileList[0]); // Chuyển đổi và upload ảnh khi nhấn nút "Submit"
          }

          await createCar([{ ...values, transport_company_id: companyId, images: uploadedImage || null }]);
          setFileList([]);
          handleReload();
          toast.success(NOTIFY_MESSAGE.ADD_SUCCESS);
          return true;
        } catch (error) {
          return false;
        }
      }}
    >
      <Row gutter={[30, 20]} className="p-5">
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
        <Col span={12}>
          <ProFormText
            name="name"
            label="Tên xe"
            rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
            className="p-4"
          ></ProFormText>
        </Col>
        <Col span={12}>
          <ProFormDigit
            name="seating_capacity"
            label="Số chỗ ngồi"
            rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
          ></ProFormDigit>
        </Col>
        <Col span={12}>
          <ProFormText
            name="license_plate"
            label="Biển số xe"
            rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
          ></ProFormText>
        </Col>
        <Col span={12}>
          <ProFormText
            name="manufacture"
            rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
            label="Hãng sản xuất"
          ></ProFormText>
        </Col>
      </Row>
      <Modal open={previewImageModal.open} title={previewImageModal.title} footer={null} onCancel={handleCancelPreview}>
        <img alt="example" style={{ width: '100%' }} src={previewImageModal.image} />
      </Modal>
    </ModalForm>
  );
};

export default AddCarModal;
