import React, { Suspense, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './sidebar';
import Header from './header';
import { useSelector } from 'react-redux';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import styled from 'styled-components';

const ContainerStyles = styled.div`
  .ant-pro-card:has(.ant-pro-card-body) {
    height: calc(100vh - 260px);
    overflow: hidden;
  }
`;

const AdminLayout = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const navigate = useNavigate();
  const [hideSideBar, setHideSideBar] = useState(false);

  const toggleSideBar = () => {
    setHideSideBar(!hideSideBar);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }
  }, [isAuthenticated, navigate, userInfo]);
  return (
    isAuthenticated && (
      <>
        <div className="flex min-h-[100vh] overflow-x-hidden">
          <Sidebar hideSideBar={hideSideBar} />
          <div className={`flex-1 transition-all ${hideSideBar ? 'xl:ml-0' : 'xl:ml-[250px]'} bg-[#F1F5F9]`}>
            <Header toggleSideBar={toggleSideBar}></Header>
            <ConfigProvider locale={viVN}>
              <ContainerStyles>
                <Outlet></Outlet>
              </ContainerStyles>
            </ConfigProvider>
          </div>
        </div>
      </>
    )
  );
};

export default AdminLayout;
