import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom/dist";

const Homepage = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    navigate("/auth/login");
  }

  return <div>Homepage</div>;
};

export default Homepage;
