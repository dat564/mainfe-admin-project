import React from 'react';
import { DashboardOutlined, TableOutlined, UserOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { sideBar } from 'configs/sidebar';

const Sidebar = ({ hideSideBar }) => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const role = userInfo?.role;
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

      {sideBar.map(
        (item) =>
          item.roles.includes(role) && (
            <div className="font-medium nav-list">
              <NavLink
                to={item.to}
                key={item.key}
                className={({ isActive, isPending }) =>
                  isPending ? 'pending' : isActive ? linkClassName + '!text-black bg-[#9b59b6]' : linkClassName
                }
              >
                {item.icon}
                {item.title}
              </NavLink>
            </div>
          )
      )}
    </div>
  );
};

export default Sidebar;
// item.roles.includes(role) &&
