import { ROLES } from 'constants';
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const requireAuthentication = (WrappedComponent, requiredRole = null) => {
  const HOC = (props) => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const userInfo = useSelector((state) => state.auth.userInfo);
    const isAdmin = userInfo?.role === ROLES.ADMIN;
    const navigate = useNavigate();

    if (!isAuthenticated) {
      // Nếu chưa đăng nhập, hiển thị thông báo hoặc chuyển hướng đến trang đăng nhập
      navigate('/auth/login');
      return <p>Bạn chưa đăng nhập.</p>;
    }

    if (!isAdmin && requiredRole && !requiredRole.includes(userInfo?.role)) {
      // Nếu không có quyền truy cập, hiển thị thông báo hoặc chuyển hướng đến trang không có quyền truy cập
      navigate('/');
      return <p>Bạn không có quyền truy cập vào trang này.</p>;
    }

    // Nếu đã đăng nhập và có quyền truy cập, render WrappedComponent
    return <WrappedComponent {...props} />;
  };

  return HOC;
};

export default requireAuthentication;
