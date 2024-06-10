// authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: localStorage.getItem("isAuthenticated") || false,
    userInfo: JSON.parse(localStorage.getItem("userInfo")) || null, // Thêm trường user để lưu thông tin người dùng
    token: localStorage.getItem("jwtToken") || null, // Lấy token từ localStorage (nếu có)
  },
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.userInfo = action.payload.user; // Lưu thông tin người dùng từ action payload
      // Lưu token vào localStorage
      localStorage.setItem("jwtToken", action.payload.access_token);
      localStorage.setItem("userInfo", JSON.stringify(action.payload.user));
      localStorage.setItem("refreshToken", action.payload.refresh_token);
      localStorage.setItem("isAuthenticated", true);
    },
    updateInfo: (state, action) => {
      const _userInfo = {
        ...state.userInfo,
        img_url: action?.payload?.img_url || state.userInfo.img_url,
      };
      state.userInfo = _userInfo;
      localStorage.setItem("userInfo", JSON.stringify(_userInfo));
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.userInfo = null; // Đặt lại thông tin người dùng khi đăng xuất
      state.token = null;

      window.location = "/auth/login";

      // Xóa token khỏi localStorage khi đăng xuất
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("userInfo");
      localStorage.removeItem("isAuthenticated");
    },
  },
});

export const { login, logout, updateInfo } = authSlice.actions;

export default authSlice.reducer;
