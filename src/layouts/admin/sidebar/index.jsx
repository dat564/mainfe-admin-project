import React from 'react';
import { DashboardOutlined, TableOutlined, UserOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Sidebar = ({ hideSideBar }) => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const linkClassName = 'flex items-center gap-3 p-3 transition-all cursor-pointer hover:text-white text-[#919eab]';

  return (
    <div
      className={`sidebar w-[250px] h-[100vh] text-white bg-[#212b36] fixed top-0 transition-all ease-in-out ${
        hideSideBar ? 'left-[-250px]' : 'left-0'
      }`}
    >
      <div className="px-6 pt-4 mb-5 logo">
        <h1 className="text-2xl font-bold">Admin 🚀🚀</h1>
      </div>

      <div className="font-medium nav-list">
        <NavLink
          to="/"
          className={({ isActive, isPending }) =>
            isPending ? 'pending' : isActive ? linkClassName + '!text-black bg-[#9b59b6]' : linkClassName
          }
        >
          <DashboardOutlined />
          Dashboard
        </NavLink>
      </div>

      <div className="font-medium nav-list">
        <NavLink
          to="/accounts"
          className={({ isActive, isPending }) =>
            isPending ? 'pending' : isActive ? linkClassName + '!text-black bg-[#9b59b6]' : linkClassName
          }
        >
          <UserOutlined />
          Quản lý tài khoản
        </NavLink>
      </div>
      <h3 className="p-3 mt-3 text-lg text-[white] font-medium">Quản lý nhà xe</h3>
      <div className="font-medium nav-list">
        <NavLink
          to="/transport_company"
          className={({ isActive, isPending }) =>
            isPending ? 'pending' : isActive ? linkClassName + '!text-black bg-[#9b59b6]' : linkClassName
          }
        >
          <TableOutlined />
          Quản lý nhà xe
        </NavLink>
      </div>
      <div className="font-medium nav-list">
        <NavLink
          to="/car"
          className={({ isActive, isPending }) =>
            isPending ? 'pending' : isActive ? linkClassName + '!text-black bg-[#9b59b6]' : linkClassName
          }
        >
          <TableOutlined />
          Quản lý xe
        </NavLink>
      </div>
      <div className="font-medium nav-list">
        <NavLink
          to="/trip"
          className={({ isActive, isPending }) =>
            isPending ? 'pending' : isActive ? linkClassName + '!text-black bg-[#9b59b6]' : linkClassName
          }
        >
          <TableOutlined />
          Quản lý chuyến
        </NavLink>
      </div>
      <div className="font-medium nav-list">
        <NavLink
          to="/ticket"
          className={({ isActive, isPending }) =>
            isPending ? 'pending' : isActive ? linkClassName + '!text-black bg-[#9b59b6]' : linkClassName
          }
        >
          <TableOutlined />
          Quản lý vé
        </NavLink>
      </div>
      <div className="font-medium nav-list">
        <NavLink
          to="/payment_method"
          className={({ isActive, isPending }) =>
            isPending ? 'pending' : isActive ? linkClassName + '!text-black bg-[#9b59b6]' : linkClassName
          }
        >
          <TableOutlined />
          Quản lý phương thức thanh toán
        </NavLink>
      </div>
      <div className="font-medium nav-list">
        <NavLink
          to="/transport_company_payment"
          className={({ isActive, isPending }) =>
            isPending ? 'pending' : isActive ? linkClassName + '!text-black bg-[#9b59b6]' : linkClassName
          }
        >
          <TableOutlined />
          Quản lý phương thức thanh toán - nhà xe
        </NavLink>
      </div>
      <div className="font-medium nav-list">
        <NavLink
          to="/calendar_trip"
          className={({ isActive, isPending }) =>
            isPending ? 'pending' : isActive ? linkClassName + '!text-black bg-[#9b59b6]' : linkClassName
          }
        >
          <TableOutlined />
          Quản lý lịch trình - nhà xe
        </NavLink>
      </div>
      <div className="font-medium nav-list">
        <NavLink
          to="/template_calendar_trip"
          className={({ isActive, isPending }) =>
            isPending ? 'pending' : isActive ? linkClassName + '!text-black bg-[#9b59b6]' : linkClassName
          }
        >
          <TableOutlined />
          Quản lý mẫu lịch trình - nhà xe
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
