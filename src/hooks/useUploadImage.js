import { useState } from 'react';
import { uploadImage } from 'services/image';
import { getBase64 } from 'utils';

export default function useUploadImage() {
  const [previewImageModal, setPreviewImageModal] = useState({
    open: false,
    image: '',
    title: ''
  });
  const [fileList, setFileList] = useState([]);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImageModal({
      image: file.url || file.preview,
      open: true,
      title: file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
    });
  };

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const handleCancelPreview = () =>
    setPreviewImageModal({
      open: false,
      image: '',
      title: ''
    });

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

  return {
    previewImageModal,
    setPreviewImageModal,
    setFileList,
    fileList,
    handlePreview,
    handleChange,
    handleCancelPreview,
    handleImageUpload
  };
}
