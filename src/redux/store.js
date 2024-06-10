// store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice"; // Import slice của bạn

const store = configureStore({
  reducer: {
    auth: authReducer, // Sử dụng authReducer làm reducer cho slice auth
  },
});

const { dispatch } = store;

export { dispatch };
export default store;
