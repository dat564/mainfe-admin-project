import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormDatePicker, ProFormRadio, ProFormText } from '@ant-design/pro-components';
import { Col, Modal, Row, Upload } from 'antd';
import { NOTIFY_MESSAGE, GENDER_OPTIONS } from 'constants';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { updateUser, getUserList } from 'services';
import { uploadImage } from 'services/image';

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const EditCarModal = ({ show, data, onClose, handleReload }) => {
  const formRef = useRef();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState([]);
  const [role, setRole] = useState();

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
      const result = resImage.data;
      return result;
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    if (!data?.id) return;
    getUserList({ id: data.id })
      .then((res) => {
        const [_data] = res.data.data;
        if (_data?.img_url) {
          setPreviewImage(_data?.img_url);
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
        setRole(_data?.role);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [data.id]);

  return (
    <ModalForm
      title="Sửa tài khoản"
      width="70%"
      open={show}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
        onCancel: () => onClose()
      }}
      onFinish={async (values) => {
        try {
          let uploadedImage;
          const _data = { ...values };
          if (fileList.length > 0 && fileList[0].originFileObj) {
            uploadedImage = await handleImageUpload(fileList[0]);
          }

          if (uploadedImage) {
            _data.img_url = uploadedImage.imageUrl;
          }

          await updateUser(data.id, _data);
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
      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={() => setPreviewOpen(false)}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </ModalForm>
  );
};

export default EditCarModal;
