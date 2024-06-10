import axios from 'axios';
import { logout } from 'redux/slices/authSlice';
import { dispatch } from 'redux/store';

const request = axios.create({
  baseURL: 'http://26.117.237.183:8123/api'
});

const refreshToken = async () => {
  try {
    const _refreshToken = localStorage.getItem('refreshToken');
    const response = await axios.get('http://26.117.237.183:8123/api/refresh', {
      headers: {
        Authorization: `Bearer ${_refreshToken}`
      }
    });

    if (response.data.status === 'success') {
      const { access_token, refresh_token } = response.data.authorisation;
      const _user = response.data.user;

      // If the refresh is successful, update the JWT token
      localStorage.setItem('userInfo', JSON.stringify(_user));
      localStorage.setItem('jwtToken', access_token);
      localStorage.setItem('refreshToken', refresh_token);
      return access_token;
    } else {
      dispatch(logout());
    }
  } catch (error) {
    dispatch(logout());
  }
};

// Add a request interceptor
request.interceptors.request.use(
  async (config) => {
    // Check if a JWT token is available in your authentication system
    const jwtToken = localStorage.getItem('jwtToken');

    if (jwtToken) {
      // Attach the JWT token to the request headers
      config.headers['Authorization'] = `Bearer ${jwtToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration and refresh
request.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired, attempt to refresh the token
      try {
        const newToken = await refreshToken();
        if (!newToken) return dispatch(logout);
        // Retry the original request with the new token
        error.config.headers['Authorization'] = `Bearer ${newToken}`;
        return axios(error.config);
      } catch (refreshError) {
        // If token refresh fails, you can handle it here
        // For example, logout the user and redirect to the login page
        // localStorage.removeItem("jwtToken");
        // redirect to login
        dispatch(logout);
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default request;
