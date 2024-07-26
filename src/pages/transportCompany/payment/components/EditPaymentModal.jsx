import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormDigit, ProFormSelect, ProFormSwitch, ProFormText } from '@ant-design/pro-components';
import { Col, Modal, Row, Upload } from 'antd';
import { NOTIFY_MESSAGE } from 'constants';
import { requestImage } from 'constants/images';
import useUploadImage from 'hooks/useUploadImage';
import React, { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { updateCompanyPayment } from 'services';
import { uploadImage } from 'services/image';
import { getPaymentList } from 'services/payment';

const EditPaymentModal = ({ handleReload, data, visible, onClose }) => {
  const formRef = useRef();
  console.log({ data });
  const { previewImageModal, fileList, handlePreview, handleChange, handleCancelPreview, setFileList } =
    useUploadImage();

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

  const handleImageUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file.originFileObj); // Đính kèm file gốc vào form data

      // Gửi yêu cầu POST đến API bằng Axios
      const resImage = await uploadImage(formData);

      // Xử lý kết quả trả về từ API
      const result = resImage.data.data;
      return result;
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    if (data.image_qr_code) {
      setFileList([
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: `${requestImage}/${data.image_qr_code}`
        }
      ]);
    }
  }, [data, setFileList]);

  return (
    <ModalForm
      title="Sửa phương thức thanh toán"
      width="50%"
      open={visible}
      autoFocusFirstInput
      initialValues={data}
      modalProps={{
        onCancel: () => onClose(),
        destroyOnClose: true
      }}
      onFinish={async (values) => {
        try {
          let uploadedImage;
          const _data = { ...values, id: data.id };
          if (fileList.length > 0 && fileList[0].originFileObj) {
            uploadedImage = await handleImageUpload(fileList[0]);
          }

          if (uploadedImage) {
            _data.image_qr_code = uploadedImage;
          }
          await updateCompanyPayment([_data]);
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

export default EditPaymentModal;
