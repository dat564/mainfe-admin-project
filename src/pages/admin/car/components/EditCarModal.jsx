import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormDigit, ProFormText } from '@ant-design/pro-components';
import { Col, Modal, Row, Upload } from 'antd';
import { image_url } from 'configs/images';
import { NOTIFY_MESSAGE } from 'constants';
import useUploadImage from 'hooks/useUploadImage';
import React, { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { updateCar } from 'services';

const EditCarModal = ({ companyId, handleReload, visible, onClose, data }) => {
  console.log({ data });
  const formRef = useRef();

  const {
    previewImageModal,
    fileList,
    handlePreview,
    handleChange,
    handleCancelPreview,
    setFileList,
    setPreviewImageModal,
    handleImageUpload
  } = useUploadImage();

  useEffect(() => {
    if (!data && !formRef.current) return;
    if (data?.images) {
      setPreviewImageModal((prev) => ({
        ...prev,
        image: image_url + data?.images
      }));
      setFileList([
        {
          name: 'image.png',
          status: 'done',
          url: image_url + data?.images
        }
      ]);
    }
    formRef.current.setFieldsValue({
      ...data
    });
  }, [data, setFileList, setPreviewImageModal]);

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <ModalForm
      formRef={formRef}
      title="Sửa xe"
      width="60%"
      open={visible}
      modalProps={{
        onCancel: () => onClose(),
        destroyOnClose: true
      }}
      onFinish={async (values) => {
        try {
          const _data = { ...values, id: data.id };
          let uploadedImage;
          if (fileList.length > 0 && fileList[0].originFileObj) {
            uploadedImage = await handleImageUpload(fileList[0]); // Chuyển đổi và upload ảnh khi nhấn nút "Submit"
          }

          if (uploadedImage) {
            _data.images = uploadedImage;
          }

          await updateCar([_data]);
          handleReload();
          onClose();
          toast.success(NOTIFY_MESSAGE.UPDATE_SUCCESS);
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

export default EditCarModal;
