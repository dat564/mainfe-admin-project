import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormDatePicker, ProFormRadio, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { Col, Modal, Row, Upload } from 'antd';
import { image_url } from 'configs/images';
import { ROLES } from 'constants';
import { NOTIFY_MESSAGE, GENDER_OPTIONS } from 'constants';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { getTransportCompany } from 'services';
import { updateUser } from 'services';
import { uploadImage } from 'services/image';

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const EditAccountModal = ({ show, data, onClose, handleReload }) => {
  const formRef = useRef();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState([]);

  const handleGetTransportCompany = async () => {
    try {
      const res = await getTransportCompany();
      const data = res.data.data;
      return data.map((item) => ({
        label: item.name,
        value: item.id
      }));
    } catch (error) {
      throw error;
    }
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  useEffect(() => {
    if (!data && !formRef.current) return;
    if (data?.images) {
      setPreviewImage((prev) => ({
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
  }, [data, setFileList]);

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const handleImageUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file.originFileObj); // Đính kèm file gốc vào form data

      // Thêm các thông tin khác cần thiết vào form data nếu có

      // Gửi yêu cầu POST đến API bằng Axios
      const resImage = await uploadImage(formData);

      // Xử lý kết quả trả về từ API
      const result = resImage.data.data;
      return result;
    } catch (error) {
      throw error;
    }
  };

  return (
    <ModalForm
      title="Sửa tài khoản"
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
        {data?.role === ROLES.DRIVER && (
          <Col span={12}>
            <ProFormSelect
              name="transport_company_id"
              label="Nhà xe"
              request={handleGetTransportCompany}
              rules={[{ required: true, message: 'Vui lòng chọn trường này' }]}
            />
          </Col>
        )}
      </Row>
      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={() => setPreviewOpen(false)}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </ModalForm>
  );
};

export default EditAccountModal;
