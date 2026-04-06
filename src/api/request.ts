import axios from 'axios';
import { ElMessage } from 'element-plus';

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 300000,
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 公共接口列表，不发送 Token
    const publicPaths = ['/user/login', '/user/register', '/user/code', '/health'];
    const isPublicPath = publicPaths.some(path => config.url?.includes(path));

    if (!isPublicPath) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res.code !== 200) {
      ElMessage.error(res.message || 'Error');
      if (res.code === 401) {
        localStorage.removeItem('token');
        window.location.href = '/';
      }
      return Promise.reject(new Error(res.message || 'Error'));
    }
    return res;
  },
  (error) => {
    ElMessage.error(error.message || 'Network Error');
    return Promise.reject(error);
  }
);

export default request;
