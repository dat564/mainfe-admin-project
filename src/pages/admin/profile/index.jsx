import { useEffect, useRef, useState } from 'react';
import { Avatar, Button, Col, Form, Input, Progress, Row, Spin, Tag, Tooltip, Typography } from 'antd';
import { LinkOutlined, UserOutlined } from '@ant-design/icons';
import { ProForm, ProFormDatePicker, ProFormRadio, ProFormText } from '@ant-design/pro-form';
// import { getFileView } from "@/services/file";
// import { getImageUrl } from "@/utils/utils";
import styles from './EditUserInfo.module.less';
import rules from './components/rules.validate';
import { getUserById } from 'services';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { NOTIFY_MESSAGE } from 'constants';
import { updateUser } from 'services';
import { uploadImage } from 'services/image';
import { dispatch } from 'redux/store';
import { updateInfo } from 'redux/slices/authSlice';
import { formatCurrency } from 'utils/utils';
import { replaceImage } from 'services/image';

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
  const [studentData, setStudentData] = useState();
  const [form] = Form.useForm();
  const user = useSelector((state) => state.auth.userInfo);
  const [visibleHistory, setVisibleHistory] = useState(false);
  const studentIdRef = useRef();
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
    if (!user?.id) return;
    getUserById(user?.id)
      .then((res) => {
        const data = res.data.data;
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
      ...values
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
        _data.img_url = uploadedImage.imageUrl;
      }
      if (uploadImage?.imageUrl) {
        dispatch(updateInfo({ img_url: uploadedImage.imageUrl }));
      }

      await updateUser(user.id, _data);
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
                    Update
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
                    {studentData && (
                      <div className={`ml-5 flex flex-col gap-3 p-5 border rounded bg-white`}>
                        <div className="flex items-center gap-3">
                          <p>Status:</p>
                          <span>
                            {studentData?.status_fee === 0 ? (
                              <Tag color="error">Debt</Tag>
                            ) : studentData.status_fee === 1 ? (
                              <Tag color="success">Suffcient</Tag>
                            ) : (
                              '-'
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <p>Process:</p>
                          <span>
                            <Tooltip
                              title={`${formatCurrency(studentData?.student_payed)}/${formatCurrency(
                                studentData?.fee_real
                              )}`}
                            >
                              <Progress
                                style={{
                                  minWidth: 200
                                }}
                                percent={((studentData?.student_payed / studentData?.fee_real) * 100).toFixed(0)}
                              ></Progress>
                            </Tooltip>
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  {studentData && (
                    <div className="">
                      <Button onClick={() => setVisibleHistory(true)} type="primary">
                        Tuition history
                      </Button>
                    </div>
                  )}
                </div>
              </Col>
              <Col span={12}>
                <ProFormText name="name" label="Name" rules={rules.name} />
              </Col>
              <Col span={12}>
                <ProFormRadio.Group
                  name="gender"
                  label="Gender"
                  options={[
                    {
                      label: 'Male',
                      value: 0
                    },
                    {
                      label: 'Female',
                      value: 1
                    },
                    {
                      label: 'Other...',
                      value: 2
                    }
                  ]}
                />
              </Col>
              <Col span={12}>
                <ProFormDatePicker name="birth_day" label="Date of birth" />
              </Col>
              <Col span={12}>
                <ProFormText name="phone" label="Phone" rules={rules.phone} />
              </Col>
              <Col span={12}>
                <ProFormText {...formItemLayout} name="address" label="Address" />
              </Col>
            </Row>

            <Title level={2} style={{ color: '#5090AE', marginTop: 20 }}>
              Account information
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
                  label="Password old"
                  rules={rules.oldPassword}
                />
              </Col>
              <Col span={12}>
                <ProFormText.Password name="passwordNew" label="Password new" rules={rules.newPassword} />
              </Col>
            </Row>
          </ProForm>
        </Spin>
      </div>
    </div>
  );
};

export default EditUserInfo;
