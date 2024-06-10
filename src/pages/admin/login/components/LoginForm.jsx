import { Button, Form, Input, Spin } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { login } from 'redux/slices/authSlice';
import { useNavigate } from 'react-router-dom/dist';

const LoginForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const res = await axios.post('http://26.117.237.183:8123/api/login', {
        email: values.username,
        password: values.password
      });
      if (res.data && res.data?.status === 'error') {
        toast.error(res.data?.message || 'Login error!', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light'
        });
        setLoading(false);
        return;
      }
      const {
        authorisation: { access_token, refresh_token },
        user
      } = res.data;
      const payload = { access_token, refresh_token, user };
      dispatch(login(payload));
      navigate('/');
      toast.success(res.data?.message || 'Login success!', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light'
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error('Login error!', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light'
      });
      console.log(error);
    }
  };

  return (
    <div className="w-full max-w-[500px] mx-auto xl:mt-[250px] sm:mt-[100px]">
      <div className="mb-5 header">
        <h1 className="mb-1 text-5xl font-bold">Đăng nhập</h1>
        <p className="text-[#a0aec0]">Vui lòng nhập email và password để đăng nhập!</p>
      </div>
      <div className="content">
        <Spin spinning={loading}>
          <Form
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              username: 'phanhuygioan815@gmail.com',
              password: '123456'
            }}
          >
            <Form.Item
              label="Tài khoản"
              name="username"
              className="mb-7"
              rules={[{ required: true, message: 'Please enter your username!' }]}
            >
              <Input className="min-h-[50px] rounded-2xl" autoComplete="off" />
            </Form.Item>
            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: 'Please enter your password!' }]}
            >
              <Input.Password className="min-h-[50px] rounded-2xl" />
            </Form.Item>
            <div className="flex items-center justify-between my-2">
              <div className="flex items-center gap-x-2"></div>
              <Link to="/" className="text-[#422af8]">
                Quên mật khẩu?
              </Link>
            </div>
            <Form.Item className="mt-5">
              <Button
                htmlType="submit"
                className="flex items-center justify-center min-h-[50px] font-semibold text-white bg-[#422af8] rounded-2xl"
                style={{ color: '#fff' }}
                block
              >
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </div>
    </div>
  );
};

export default LoginForm;
