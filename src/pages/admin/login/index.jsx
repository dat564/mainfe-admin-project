import React from 'react';
import LoginForm from './components/LoginForm';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Login = () => {
  const navigate = useNavigate();
  const isAuthenticate = useSelector((state) => state.auth.isAuthenticate);
  if (isAuthenticate) {
    navigate('/');
  }
  return (
    <>
      <div className="flex w-full h-full">
        <div className="flex-1 dark:bg-[##0b1437]">
          <LoginForm></LoginForm>
        </div>
        <div className="flex-1 sm:hidden xl:block">
          <img src="/imgs/auth.png" className="w-full h-[100vh] object-cover rounded-bl-[250px]" alt="" />
        </div>
      </div>
    </>
  );
};

export default Login;
