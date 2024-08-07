import { FolderAddOutlined, PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormDatePicker, ProFormRadio, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { Col, Modal, Row, Upload } from 'antd';
import { NOTIFY_MESSAGE, GENDER_OPTIONS, ROLES, ROLES_OBJ } from 'constants';
import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getTransportCompany } from 'services';
import { createUser } from 'services';
import { uploadImage } from 'services/image';

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const AddDriverModal = ({ handleReload }) => {
  const formRef = useRef();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState([]);
  const { transport_company } = useSelector((state) => state.auth.userInfo);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

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
      title="Thêm tài xế"
      width="70%"
      trigger={
        <span className="flex items-center justify-center p-3 transition-all bg-white border border-gray-200 rounded-md shadow-sm cursor-pointer hover:bg-gray-200">
          <FolderAddOutlined />
        </span>
      }
      initialValues={{
        gender: 0
      }}
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
          let uploadedImage;
          if (fileList.length > 0 && fileList[0].originFileObj) {
            uploadedImage = await handleImageUpload(fileList[0]); // Chuyển đổi và upload ảnh khi nhấn nút "Submit"
          }

          await createUser({
            ...values,
            img_url: uploadedImage || null,
            role: ROLES.DRIVER,
            transport_company_id: transport_company.id
          });
          toast.success(NOTIFY_MESSAGE.ADD_SUCCESS);
          setFileList([]);
          handleReload();
          return true;
        } catch (err) {}
      }}
      formRef={formRef}
      className="px-10 py-5"
    >
      <Row gutter={[30, 20]}>
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
            label="Họ và tên"
            rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
            className="p-4"
          ></ProFormText>
        </Col>
        <Col span={12}>
          <ProFormText
            name="phone"
            label="Di động"
            rules={[
              { required: true, message: 'Vui lòng nhập trường này' },
              {
                pattern: new RegExp(/(84|0[3|5|7|8|9])+([0-9]{8})\b/),
                message: 'Số điện thoại không hợp lệ'
              }
            ]}
          ></ProFormText>
        </Col>
        <Col span={12}>
          <ProFormText
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập trường này' },
              {
                type: 'email',
                message: 'Email không hợp lệ'
              }
            ]}
          ></ProFormText>
        </Col>
        <Col span={12}>
          <ProFormText.Password
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập trường này' }]}
            label="Password"
            placeholder="Please enter password"
          ></ProFormText.Password>
        </Col>
        <Col span={12}>
          <ProFormText name="address" label="Địa chỉ"></ProFormText>
        </Col>
        <Col span={12}>
          <ProFormText name="CIC_code" label="Số chứng minh nhân dân"></ProFormText>
        </Col>
        <Col span={12}>
          <ProFormDatePicker name="birth_day" label="Ngày sinh"></ProFormDatePicker>
        </Col>
        <Col span={12}>
          <ProFormText name="birth_place" label="Nơi sinh"></ProFormText>
        </Col>
        <Col span={12}>
          <ProFormText name="permanent_residence" label="Hộ khẩu thường trú"></ProFormText>
        </Col>
        <Col span={12}>
          <ProFormText name="ethnicity" label="Dân tộc"></ProFormText>
        </Col>
        <Col span={12}>
          <ProFormRadio.Group name="gender" label="Giới tính" options={GENDER_OPTIONS} />
        </Col>
      </Row>
      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={() => setPreviewOpen(false)}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </ModalForm>
  );
};

export default AddDriverModal;
