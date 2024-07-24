import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormDatePicker, ProFormRadio, ProFormText } from '@ant-design/pro-components';
import { Col, Modal, Row, Upload } from 'antd';
import { image_url } from 'configs/images';
import { NOTIFY_MESSAGE, GENDER_OPTIONS } from 'constants';
import useUploadImage from 'hooks/useUploadImage';
import React, { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { updateUser } from 'services';

const EditDriverModal = ({ show, data, onClose, handleReload }) => {
  console.log({ data });
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
    if (data?.img_url) {
      setPreviewImageModal((prev) => ({
        ...prev,
        image: image_url + data?.img_url
      }));
      setFileList([
        {
          name: 'image.png',
          status: 'done',
          url: image_url + data?.img_url
        }
      ]);
    }
    formRef.current.setFieldsValue({
      ...data
    });
  }, [data, setFileList, setPreviewImageModal]);

  return (
    <ModalForm
      title="Sửa tài xế"
      width="70%"
      open={show}
      autoFocusFirstInput
      initialValues={data}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => onClose()
      }}
      onFinish={async (values) => {
        try {
          let uploadedImage;
          const _data = { ...values, id: data.id };
          if (fileList.length > 0 && fileList[0].originFileObj) {
            uploadedImage = await handleImageUpload(fileList[0]);
          }

          if (uploadedImage) {
            _data.img_url = uploadedImage;
          }

          await updateUser(_data);
          toast.success(NOTIFY_MESSAGE.UPDATE_SUCCESS);
          onClose();
        } catch (error) {
          toast.error(error.response.data.message);
        }

        handleReload();
      }}
      formRef={formRef}
      className="px-10 py-5"
    >
      <Row gutter={[30, 20]}>
        <Col span={12}>
          <h1 className="mb-2">Ảnh</h1>
          <Upload
            action="#"
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
            label="Họ và tên"
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
            placeholder="Please enter a email"
          ></ProFormText>
        </Col>
        <Col span={12}>
          <ProFormText name="address" label="Địa chỉ"></ProFormText>
        </Col>
        <Col span={12}>
          <ProFormText name="CIC_code" label="Chứng minh nhân dân"></ProFormText>
        </Col>
        <Col span={12}>
          <ProFormDatePicker name="birth_day" label="Ngày sinh"></ProFormDatePicker>
        </Col>
        <Col span={12}>
          <ProFormText name="birth_place" label="Nơi sinh"></ProFormText>
        </Col>
        <Col span={12}>
          <ProFormText name="permanent_residence" label="Hộ khẩu thường chú"></ProFormText>
        </Col>
        <Col span={12}>
          <ProFormText name="ethnicity" label="Dân tộc"></ProFormText>
        </Col>
        <Col span={12}>
          <ProFormRadio.Group name="gender" label="Giới tính" options={GENDER_OPTIONS} />
        </Col>
      </Row>
      <Modal open={previewImageModal.open} title={previewImageModal.title} footer={null} onCancel={handleCancelPreview}>
        <img alt="example" style={{ width: '100%' }} src={previewImageModal.image} />
      </Modal>
    </ModalForm>
  );
};

export default EditDriverModal;
