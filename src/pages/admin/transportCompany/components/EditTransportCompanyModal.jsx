import { PlusOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { Col, Modal, Row, Upload } from 'antd';
import { NOTIFY_MESSAGE } from 'constants';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { getUserList } from 'services';

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const EditTransportCompanyModal = ({ show, data, onClose, handleReload }) => {
  const formRef = useRef();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState([]);

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

  useEffect(() => {
    if (!data?.user?.id) return;
    getUserList({ id: data.user.id })
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
          ..._data,
          transport_name: _data?.transport_company?.name
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [data.user.id]);
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
      onFinish={async (values) => {
        try {
          // await updateMajorById(data.id, values);
          onClose();
          toast.success(NOTIFY_MESSAGE.UPDATE_SUCCESS);
        } catch (error) {
          toast.error(error.response.data.message);
        }

        handleReload();
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
      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={() => setPreviewOpen(false)}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </ModalForm>
  );
};

export default EditTransportCompanyModal;
