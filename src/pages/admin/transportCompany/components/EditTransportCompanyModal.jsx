import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { Col, Modal, Row, Upload } from 'antd';
import { image_url } from 'configs/images';
import { NOTIFY_MESSAGE } from 'constants';
import useUploadImage from 'hooks/useUploadImage';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { updateTransportCompany } from 'services';
import { updateUser } from 'services';

const EditTransportCompanyModal = ({ show, data, onClose, reloadTable }) => {
  const formRef = useRef();
  const {
    previewImageModal,
    fileList,
    handlePreview,
    handleChange,
    handleCancelPreview,
    handleImageUpload,
    setPreviewImageModal,
    setFileList
  } = useUploadImage();

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

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

  return (
    <ModalForm
      title="Sửa nhà xe"
      width="70%"
      open={show}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
        onCancel: () => onClose()
      }}
      initialValues={{
        transport_name: data.name,
        ...(data?.user ?? [])
      }}
      onFinish={async (values) => {
        let uploadedImage;
        if (fileList.length > 0 && fileList[0].originFileObj) {
          uploadedImage = await handleImageUpload(fileList[0]); // Chuyển đổi và upload ảnh khi nhấn nút "Submit"
        }
        const _data = {
          ...values,
          id: data?.user?.id,
          img_url: uploadedImage || null
        };
        const transportData = {
          name: values.transport_name,
          id: data.id
        };
        await Promise.all([updateTransportCompany([transportData]), updateUser(_data)]);
        onClose();
        reloadTable();
        toast.success(NOTIFY_MESSAGE.UPDATE_SUCCESS);
      }}
      formRef={formRef}
      className="p-10"
    >
      <Row gutter={[30, 20]}>
        <Col span={12}>
          <h1 className="mb-2">Ảnh</h1>
          <Upload
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
            name="transport_name"
            label="Tên nhà xe"
            rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
            className="p-4"
          ></ProFormText>
        </Col>
        <Col span={12}>
          <ProFormText
            name="phone"
            label="Di động"
            rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
          ></ProFormText>
        </Col>
        <Col span={12}>
          <ProFormText
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
          ></ProFormText>
        </Col>
        <Col span={12}>
          <ProFormText name="address" label="Địa chỉ"></ProFormText>
        </Col>
      </Row>
      <Modal open={previewImageModal.open} title={previewImageModal.title} footer={null} onCancel={handleCancelPreview}>
        <img alt="example" style={{ width: '100%' }} src={previewImageModal.image} />
      </Modal>
    </ModalForm>
  );
};

export default EditTransportCompanyModal;
