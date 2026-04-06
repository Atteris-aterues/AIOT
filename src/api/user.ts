import request from './request';
import type { 
  LoginParams, 
  LoginResponse, 
  RegisterParams, 
  RegisterResponse, 
  UserInfoResponse
} from './types';

// 登录接口
export const login = (data: LoginParams): Promise<LoginResponse> => {
  return request.post('user/login', data);
};

// 注册接口
export const register = (data: RegisterParams): Promise<RegisterResponse> => {
  return request.post('user/register', data);
};

// 获取当前用户信息
export const getUserMe = (): Promise<UserInfoResponse> => {
  return request.get('user/me');
};

// 退出登录
export const logout = (): Promise<void> => {
  return request.post('user/logout');
};

// 修改个人信息
export const updateProfile = (data: { username: string; avatar: string }): Promise<any> => {
  return request.post('user/profile', data);
};

// 修改密码
export const updatePassword = (data: { oldPassword: string; newPassword: string }): Promise<any> => {
  return request.post('user/password', data);
};

// 头像上传
export const uploadAvatar = (file: File): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);
  return request.post('user/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
