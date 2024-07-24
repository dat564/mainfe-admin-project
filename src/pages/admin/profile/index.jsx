import { useEffect, useRef, useState } from 'react';
import { Avatar, Button, Col, Form, Input, Row, Spin, Typography } from 'antd';
import { LinkOutlined, UserOutlined } from '@ant-design/icons';
import { ProForm, ProFormDatePicker, ProFormRadio, ProFormText } from '@ant-design/pro-form';
import styles from './EditUserInfo.module.less';
import rules from './components/rules.validate';
import { getUserList } from 'services';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { NOTIFY_MESSAGE } from 'constants';
import { updateUser } from 'services';
import { uploadImage } from 'services/image';
import { dispatch } from 'redux/store';
import { updateInfo } from 'redux/slices/authSlice';
import { replaceImage } from 'services/image';
import requireAuthentication from 'hoc/requireAuthentication';
import { ROLES } from 'constants';

const { Title } = Typography;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 24 },
    lg: { span: 11 },
    xl: { span: 11 },
    xxl: { span: 11 }
  },
  wrapperCol: {
    xs: { span: 22 },
    sm: { span: 22 },
    md: { span: 22 },
    lg: { span: 22 },
    xl: { span: 22 },
    xxl: { span: 22 }
  }
};

const EditUserInfo = function () {
  const [loading, setLoading] = useState(false);
  const [avatarLink, setAvatarLink] = useState('');
  const [fileList, setFileList] = useState([]);
  const [isHasImage, setIsHasImage] = useState(false);
  const [form] = Form.useForm();
  const user = useSelector((state) => state.auth.userInfo);
  const [imageName, setImageName] = useState('');
  const fileInputRef = useRef(null);

  const clearFileInput = () => {
    // Thiết lập giá trị của input file thành chuỗi rỗng
    fileInputRef.current.value = '';
  };

  function handleFileChange(event) {
    const file = event.target.files[0];
    setFileList([file]);

    if (file) {
      const reader = new FileReader();

      reader.onload = function (event) {
        const base64String = event.target.result;
        // Đây là nơi bạn có thể sử dụng base64String, ví dụ: in ra console hoặc thực hiện các hành động khác với chuỗi base64
        setAvatarLink(base64String);
      };

      reader.readAsDataURL(file);
    }

    clearFileInput();
  }

  useEffect(() => {
    if (!user.id) return;
    getUserList({ id: user.id })
      .then((res) => {
        const [data] = res.data.data || [];
        console.log({ data });
        if (data?.img_url) {
          const _imageName = data.img_url.split('/').pop().split('.')[0];
          setImageName(_imageName);
          setIsHasImage(true);
          setAvatarLink(data?.img_url);
        }
        form.setFieldsValue({
          ...data
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [form, user?.id]);

  const handleImageUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file); // Đính kèm file trực tiếp vào form data

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

  const handleReplaceImage = async (imageName, file) => {
    try {
      const formData = new FormData();
      formData.append('new_image', file); // Đính kèm file gốc vào form data

      // Thêm các thông tin khác cần thiết vào form data nếu có

      // Gửi yêu cầu POST đến API bằng Axios
      const resImage = await replaceImage(imageName, formData);

      // Xử lý kết quả trả về từ API
      const result = resImage.data;
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleSubmit = async (values) => {
    if (!user.id) return;
    setLoading(true);
    const _data = {
      ...user,
      ...values,
      id: user.id
    };
    try {
      let uploadedImage;
      if (fileList.length > 0) {
        if (!isHasImage) {
          uploadedImage = await handleImageUpload(fileList[0]); // Chuyển đổi và upload ảnh khi nhấn nút "Submit"
        } else {
          await handleReplaceImage(imageName, fileList[0]);
        }
      }

      if (uploadedImage) {
        _data.img_url = uploadedImage;
      }
      if (uploadImage?.imageUrl) {
        dispatch(updateInfo({ img_url: uploadedImage.imageUrl }));
      }

      await updateUser(_data);
      toast.success(NOTIFY_MESSAGE.UPDATE_SUCCESS);
    } catch (error) {
      toast.error(error.response.data.message);
    }
    setLoading(false);
  };

  return (
    <div className="w-full p-10">
      <div className="px-20">
        <Spin spinning={loading}>
          <ProForm
            form={form}
            onFinish={handleSubmit}
            submitter={{
              render: (props) => (
                <div className="flex justify-center mt-10">
                  <Button
                    type="primary"
                    className={styles.actionBtn}
                    style={{ marginLeft: -25 }}
                    htmlType="submit"
                    onClick={() => props.form?.submit()}
                  >
                    Cập nhật
                  </Button>
                </div>
              )
            }}
          >
            <Row gutter={[130, 12]}>
              <Col span={24}>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-5">
                    <Avatar size={100} icon={<UserOutlined />} src={avatarLink} />
                    <div className={styles.uploadBlock}>
                      <Title level={4}>Avatar</Title>
                      <Button
                        icon={<LinkOutlined />}
                        onClick={() => {
                          document.getElementById('fileInput').click();
                        }}
                      >
                        Upload image
                        <Input
                          type="file"
                          ref={fileInputRef}
                          id="fileInput"
                          style={{ display: 'none' }}
                          accept="image/jpeg,image/gif,image/png,application/pdf,image/x-eps"
                          onChange={handleFileChange}
                        />
                      </Button>
                    </div>
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <ProFormText name="name" label="Họ và tên" rules={rules.name} />
              </Col>
              <Col span={12}>
                <ProFormRadio.Group
                  name="gender"
                  label="Giới tính"
                  options={[
                    {
                      label: 'Nam',
                      value: 0
                    },
                    {
                      label: 'Nữ',
                      value: 1
                    },
                    {
                      label: 'Khác...',
                      value: 2
                    }
                  ]}
                />
              </Col>
              <Col span={12}>
                <ProFormDatePicker name="birth_day" label="Ngày sinh" />
              </Col>
              <Col span={12}>
                <ProFormText name="phone" label="Số điện thoại" rules={rules.phone} />
              </Col>
              <Col span={12}>
                <ProFormText {...formItemLayout} name="address" label="Địa chỉ" />
              </Col>
            </Row>

            <Title level={2} style={{ color: '#5090AE', marginTop: 20 }}>
              Thông tin tài khoản
            </Title>

            <Row gutter={[130, 12]}>
              <Col span={12}>
                <ProFormText name="email" label="Email" />
              </Col>
              <Col span={12}></Col>
              <Col span={12}>
                <ProFormText.Password
                  id="password_old"
                  name="passwordOld"
                  label="Mật khẩu cũ"
                  rules={rules.oldPassword}
                />
              </Col>
              <Col span={12}>
                <ProFormText.Password name="passwordNew" label="Mật khẩu mới" rules={rules.newPassword} />
              </Col>
            </Row>
          </ProForm>
        </Spin>
      </div>
    </div>
  );
};

export default requireAuthentication(EditUserInfo, [ROLES.ADMIN, ROLES.TRANSPORT_COMPANY]);
