import { Avatar, Dropdown, Input } from "antd";
import Bar from "components/icons/Bar";
import { BellOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Header = ({ toggleSideBar }) => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const navigate = useNavigate();

  const items = [
    {
      label: "Profile",
      key: "1",
      icon: <UserOutlined />,
      onClick: () => navigate("/profile"),
    },
    {
      label: "Logout",
      key: "2",
      icon: <LogoutOutlined />,
      onClick: () => {
        dispatch(logout());
        toast.success("Logout success!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        navigate("/auth/login");
      },
    },
  ];

  return (
    <div
      className="w-full h-[60px] px-6 py-3 bg-white flex items-center justify-between sticky top-0 z-10
    "
    >
      <div className="flex items-center gap-5">
        <Bar onClick={toggleSideBar}></Bar>
      </div>
      <div className="flex items-center gap-3">
        <Dropdown menu={{ items }} trigger={["click"]}>
          <Avatar
            size="large"
            icon={<UserOutlined />}
            src={userInfo?.img_url || null}
          />
        </Dropdown>
      </div>
    </div>
  );
};

export default Header;
