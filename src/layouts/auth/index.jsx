import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom/dist";

const AuthLayout = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
      return;
    }
  }, []);
  return (
    <>
      <Outlet></Outlet>
    </>
  );
};

export default AuthLayout;
