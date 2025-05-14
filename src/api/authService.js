import axios from 'axios';
import config from './config';

const apiClient = axios.create({
  baseURL: config.API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

// 用户注册 API
export const register = async (username, email, password) => {
  try {
    const response = await apiClient.post('/register', {
      username,
      email,
      password
    });

    // 假设后端返回格式为：{ success: true, message: '注册成功' }
    return response.data;
  } catch (error) {
    console.error('Register API Error:', error);
    return {
      success: false,
      message: error.response?.data?.message || '注册失败'
    };
  }
};


// 用户登录 API
export const loginApi = async (email, password) => {
  try {
    const response = await apiClient.post('/login', {
      email,
      password
    });
    console.log(response, 'response');
    // 假设后端返回格式为：{ success: true, token, user }
    return response.data;
  } catch (error) {
    console.error('Login API Error:', error);
    return {
      success: false,
      message: error.response?.data?.message || '登录失败'
    };
  }
};
